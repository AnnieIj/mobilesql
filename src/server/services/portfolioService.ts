import { portfolioRepository } from '../repositories/portfolioRepository';
import { certificateRepository } from '../repositories/certificateRepository';
import { PortfolioProject, Certificate } from '../types';

export class PortfolioService {
  async getProjects(userId?: string): Promise<PortfolioProject[]> {
    return portfolioRepository.getProjects(userId);
  }

  async createProject(data: Omit<PortfolioProject, 'id' | 'viewsCount' | 'likesCount' | 'createdAt' | 'updatedAt'>): Promise<PortfolioProject> {
    return portfolioRepository.createProject(data);
  }

  async deleteProject(id: string): Promise<boolean> {
    return portfolioRepository.deleteProject(id);
  }

  async getCertificates(userId: string): Promise<Certificate[]> {
    return certificateRepository.getCertificatesByUser(userId);
  }

  async issueCertificate(data: Omit<Certificate, 'id' | 'issuedAt' | 'credentialId'>): Promise<Certificate> {
    return certificateRepository.createCertificate(data);
  }
}

export const portfolioService = new PortfolioService();
