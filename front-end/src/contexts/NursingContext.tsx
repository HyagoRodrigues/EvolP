import { createContext, useContext, useState, ReactNode } from 'react';

interface NursingData {
  avaliacao: any;
  diagnostico: any;
  planejamento: any;
  implementacao: any;
  evolucao: any;
}

interface NursingContextType {
  nursingData: NursingData;
  updateNursingData: (step: keyof NursingData, data: any) => void;
  clearNursingData: () => void;
}

const NursingContext = createContext<NursingContextType | undefined>(undefined);

export function NursingProvider({ children }: { children: ReactNode }) {
  const [nursingData, setNursingData] = useState<NursingData>({
    avaliacao: null,
    diagnostico: null,
    planejamento: null,
    implementacao: null,
    evolucao: null
  });

  const updateNursingData = (step: keyof NursingData, data: any) => {
    setNursingData(prev => ({
      ...prev,
      [step]: data
    }));
  };

  const clearNursingData = () => {
    setNursingData({
      avaliacao: null,
      diagnostico: null,
      planejamento: null,
      implementacao: null,
      evolucao: null
    });
  };

  return (
    <NursingContext.Provider value={{ nursingData, updateNursingData, clearNursingData }}>
      {children}
    </NursingContext.Provider>
  );
}

export const useNursing = () => {
  const context = useContext(NursingContext);
  if (context === undefined) {
    throw new Error('useNursing must be used within a NursingProvider');
  }
  return context;
};