import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  MenuItem,
  IconButton,
  Stack,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, ArrowBack as ArrowBackIcon, Home as HomeIcon } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import Layout from '../components/Layout';
import { Alert, Snackbar } from '@mui/material';
import { validateCPF } from '../utils/validations';

// Constantes para opções do formulário
const TIPOS_SANGUINEOS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Não sabe'];
const ESTADO_CIVIL = ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'Separado(a)'];
const ESCOLARIDADE = [
  'Ensino Fundamental',
  'Ensino Médio',
  'Ensino Superior',
  'Pós-Graduação',
  'Mestrado',
  'Doutorado',
  'Não informado',
];
const SEXO = ['Masculino', 'Feminino', 'Outro', 'Prefiro não informar'];

interface FormData {
  nome: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  leito: string;
  nomeMae: string;
  nomePai: string;
  tipoSanguineo: string;
  endereco: string;
  estadoCivil: string;
  escolaridade: string;
  ocupacao: string;
  sexo: string;
  alergias: string[];
  medicamentos: Medication[];
  usoAlcool: string;
  usoDrogas: string;
}

interface Medication {
  substancia: string;
  dose: string;
  horario: string;
}

export default function CadastrarPaciente() {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    cpf: '',
    rg: '',
    dataNascimento: '',
    leito: '',
    nomeMae: '',
    nomePai: '',
    tipoSanguineo: '',
    endereco: '',
    estadoCivil: '',
    escolaridade: '',
    ocupacao: '',
    sexo: '',
    alergias: [],
    medicamentos: [],
    usoAlcool: '',
    usoDrogas: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [novaAlergia, setNovaAlergia] = useState('');
  const [novoMedicamento, setNovoMedicamento] = useState<Medication>({
    substancia: '',
    dose: '',
    horario: '',
  });
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  const resetForm = () => {
    setFormData({
      nome: '',
      cpf: '',
      rg: '',
      dataNascimento: '',
      leito: '',
      nomeMae: '',
      nomePai: '',
      tipoSanguineo: '',
      endereco: '',
      estadoCivil: '',
      escolaridade: '',
      ocupacao: '',
      sexo: '',
      alergias: [],
      medicamentos: [],
      usoAlcool: '',
      usoDrogas: '',
    });
    setErrors({});
    setNovaAlergia('');
    setNovoMedicamento({ substancia: '', dose: '', horario: '' });
  };
  const handleShowMessage = (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };
  const handleAddAlergia = () => {
    if (novaAlergia.trim()) {
      setFormData((prev) => ({
        ...prev,
        alergias: [...prev.alergias, novaAlergia.trim()],
      }));
      setNovaAlergia('');
      handleShowMessage('Alergia adicionada com sucesso', 'success');
    } else {
      handleShowMessage('Por favor, digite uma alergia válida', 'warning');
    }
  };
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    let hasErrors = false;
    let errorMessages: string[] = [];
  
    if (!formData.nome) {
      newErrors.nome = 'Nome é obrigatório';
      errorMessages.push('Nome é obrigatório');
      hasErrors = true;
    }
    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
      errorMessages.push('Data de nascimento é obrigatória');
      hasErrors = true;
    }
    if (!formData.leito) {
      newErrors.leito = 'Leito é obrigatório';
      errorMessages.push('Leito é obrigatório');
      hasErrors = true;
    }
    
    if (formData.cpf) {
      if (!validateCPF(formData.cpf)) {
        newErrors.cpf = 'CPF inválido';
        errorMessages.push('CPF inválido');
        hasErrors = true;
      } else {
        const pacientes = JSON.parse(localStorage.getItem('pacientes') || '[]');
        const cpfExists = pacientes.some((p: any) => p.cpf === formData.cpf);
        if (cpfExists) {
          newErrors.cpf = 'CPF já cadastrado';
          errorMessages.push('CPF já cadastrado');
          hasErrors = true;
        }
      }
    }
  
    setErrors(newErrors);
  
    if (hasErrors) {
      handleShowMessage(
        errorMessages.length > 1 
          ? `Erros encontrados:\n${errorMessages.join('\n')}`
          : errorMessages[0],
        'error'
      );
    }
  
    return !hasErrors;
  };
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
  
    if (validateForm()) {
      try {
        const pacientes = JSON.parse(localStorage.getItem('pacientes') || '[]');
        const novoPaciente = {
          ...formData,
          id: crypto.randomUUID(),
          dataCadastro: new Date().toISOString()
        };
        
        pacientes.push(novoPaciente);
        localStorage.setItem('pacientes', JSON.stringify(pacientes));
  
        formRef.current?.reset();
        resetForm();
  
        handleShowMessage('Paciente cadastrado com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao salvar paciente:', error);
        handleShowMessage('Erro ao salvar o paciente. Por favor, tente novamente.', 'error');
      }
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };
  const handleAddMedicamento = (): void => {
    if (novoMedicamento.substancia && novoMedicamento.dose && novoMedicamento.horario) {
      setFormData((prev) => ({
        ...prev,
        medicamentos: [...prev.medicamentos, novoMedicamento],
      }));
      setNovoMedicamento({ substancia: '', dose: '', horario: '' });
      handleShowMessage('Medicamento adicionado com sucesso', 'success');
    } else {
      handleShowMessage('Por favor, preencha todos os campos do medicamento', 'warning');
    }
  };
  const handleRemoveAlergia = (index: number): void => {
    if (window.confirm('Tem certeza que deseja remover esta alergia?')) {
      setFormData((prev) => ({
        ...prev,
        alergias: prev.alergias.filter((_, i) => i !== index),
      }));
      handleShowMessage('Alergia removida com sucesso', 'info');
    }
  };
  const handleRemoveMedicamento = (index: number): void => {
    if (window.confirm('Tem certeza que deseja remover este medicamento?')) {
      setFormData((prev) => ({
        ...prev,
        medicamentos: prev.medicamentos.filter((_, i) => i !== index),
      }));
      handleShowMessage('Medicamento removido com sucesso', 'info');
    }
  };
  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.back()}
            >
              Voltar
            </Button>
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={() => router.push('/')}
            >
              Página Inicial
            </Button>
          </Stack>
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            Cadastro de Paciente
          </Typography>
          <Box component="form" ref={formRef} onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Nome do Paciente"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Digite o nome completo do paciente"
                  error={!!errors.nome}
                  helperText={errors.nome}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CPF"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  placeholder="Digite o CPF do paciente"
                  error={!!errors.cpf}
                  helperText={errors.cpf}
                  inputProps={{
                    maxLength: 11,
                    pattern: '[0-9]*'
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="RG"
                  name="rg"
                  value={formData.rg}
                  onChange={handleInputChange}
                  placeholder="Digite o RG do paciente"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  label="Data de Nascimento"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.dataNascimento}
                  helperText={errors.dataNascimento}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Leito"
                  name="leito"
                  value={formData.leito}
                  onChange={handleInputChange}
                  placeholder="Digite o número do leito"
                  error={!!errors.leito}
                  helperText={errors.leito}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nome da Mãe"
                  name="nomeMae"
                  value={formData.nomeMae}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nome do Pai"
                  name="nomePai"
                  value={formData.nomePai}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Tipo Sanguíneo"
                  name="tipoSanguineo"
                  value={formData.tipoSanguineo}
                  onChange={handleInputChange}
                >
                  {TIPOS_SANGUINEOS.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Endereço"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Estado Civil"
                  name="estadoCivil"
                  value={formData.estadoCivil}
                  onChange={handleInputChange}
                >
                  {ESTADO_CIVIL.map((estado) => (
                    <MenuItem key={estado} value={estado}>
                      {estado}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Escolaridade"
                  name="escolaridade"
                  value={formData.escolaridade}
                  onChange={handleInputChange}
                >
                  {ESCOLARIDADE.map((nivel) => (
                    <MenuItem key={nivel} value={nivel}>
                      {nivel}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ocupação"
                  name="ocupacao"
                  value={formData.ocupacao}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Sexo"
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleInputChange}
                >
                  {SEXO.map((sexo) => (
                    <MenuItem key={sexo} value={sexo}>
                      {sexo}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Alergias
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    fullWidth
                    label="Nova Alergia"
                    value={novaAlergia}
                    onChange={(e) => setNovaAlergia(e.target.value)}
                  />
                  <IconButton color="primary" onClick={handleAddAlergia}>
                    <AddIcon />
                  </IconButton>
                </Stack>
                <Stack spacing={1} sx={{ mt: 2 }}>
                  {formData.alergias.map((alergia, index) => (
                    <Stack key={index} direction="row" spacing={2} alignItems="center">
                      <Typography>{alergia}</Typography>
                      <IconButton color="error" onClick={() => handleRemoveAlergia(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Medicamentos de Uso Contínuo
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    fullWidth
                    label="Princípio Ativo"
                    value={novoMedicamento.substancia}
                    onChange={(e) =>
                      setNovoMedicamento((prev) => ({ ...prev, substancia: e.target.value }))
                    }
                  />
                  <TextField
                    fullWidth
                    label="Dose"
                    value={novoMedicamento.dose}
                    onChange={(e) =>
                      setNovoMedicamento((prev) => ({ ...prev, dose: e.target.value }))
                    }
                  />
                  <TextField
                    fullWidth
                    label="Horário"
                    value={novoMedicamento.horario}
                    onChange={(e) =>
                      setNovoMedicamento((prev) => ({ ...prev, horario: e.target.value }))
                    }
                  />
                  <IconButton color="primary" onClick={handleAddMedicamento}>
                    <AddIcon />
                  </IconButton>
                </Stack>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  {formData.medicamentos.map((medicamento, index) => (
                    <Grid container spacing={2} key={index}>
                      <Grid item xs={12} md={4}>
                        <Typography>Princípio Ativo: {medicamento.substancia}</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography>Dose: {medicamento.dose}</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography>Horário: {medicamento.horario}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <IconButton color="error" onClick={() => handleRemoveMedicamento(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                >
                  Cadastrar
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Layout>
  );