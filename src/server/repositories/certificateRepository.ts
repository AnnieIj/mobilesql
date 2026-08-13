import { db } from '../database/db';
import { Certificate } from '../types';

export class CertificateRepository {
  async getCertificatesByUser(userId: string): Promise<Certificate[]> {
    const list: Certificate[] = [];
    for (const c of db.certificates.values()) {
      if (c.userId === userId) {
        list.push(c);
      }
    }
    return list;
  }

  async createCertificate(data: Omit<Certificate, 'id' | 'issuedAt' | 'credentialId'>): Promise<Certificate> {
    const id = `cert_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const credentialId = `MSQL-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const entity: Certificate = {
      ...data,
      id,
      credentialId,
      issuedAt: new Date().toISOString(),
      certificateUrl: `https://mobilesql.app/verify/${credentialId}`,
    };

    db.certificates.set(id, entity);
    return entity;
  }
}

export const certificateRepository = new CertificateRepository();
