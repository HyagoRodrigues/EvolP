import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', error);

  if (error.code === 'PGRST116') {
    res.status(404).json({
      error: 'Recurso não encontrado'
    });
    return;
  }

  res.status(500).json({
    error: 'Erro interno do servidor'
  });
};