'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Clinic } from '@/lib/types';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface BookingFormProps {
  clinic: Clinic;
  onBack: () => void;
}

export default function BookingForm({ clinic, onBack }: BookingFormProps) {
  const [form, setForm] = useState({ nome: '', telefone: '', cidade: '', horario: 'manha' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to an API
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="text-center space-y-4">
          <div className="text-5xl">🎉</div>
          <h3 className="text-xl font-bold text-gray-900">Solicitação enviada!</h3>
          <p className="text-sm text-gray-600">
            A clínica <strong>{clinic.nome}</strong> entrará em contato pelo telefone informado para confirmar seu agendamento.
          </p>
          <a
            href={`https://wa.me/${clinic.whatsapp}?text=${encodeURIComponent(
              `Olá! Sou ${form.nome}, acabei de solicitar um agendamento pelo DentAI. Gostaria de confirmar minha consulta.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors w-full"
          >
            Confirmar via WhatsApp
          </a>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <button onClick={onBack} className="text-sm text-sky-600 mb-3 flex items-center gap-1">
          ← Voltar
        </button>
        <h3 className="font-bold text-gray-900 mb-1">Agendar em {clinic.nome}</h3>
        <p className="text-xs text-gray-500 mb-4">{clinic.endereco}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              required
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
              placeholder="Seu nome completo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input
              type="tel"
              required
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
              placeholder="(00) 00000-0000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
            <input
              type="text"
              required
              value={form.cidade}
              onChange={(e) => setForm({ ...form, cidade: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
              placeholder="Sua cidade"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Horário preferido</label>
            <select
              value={form.horario}
              onChange={(e) => setForm({ ...form, horario: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm bg-white"
            >
              <option value="manha">Manhã (8h - 12h)</option>
              <option value="tarde">Tarde (13h - 17h)</option>
              <option value="noite">Noite (18h - 21h)</option>
            </select>
          </div>
          <Button type="submit" variant="primary" className="w-full" size="lg">
            Solicitar agendamento
          </Button>
        </form>
      </Card>
    </motion.div>
  );
}
