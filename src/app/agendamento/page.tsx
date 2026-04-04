'use client';

import { useState } from 'react';
import StepProgress from '@/components/StepProgress';
import ClinicList from '@/components/booking/ClinicList';
import BookingForm from '@/components/booking/BookingForm';
import type { Clinic } from '@/lib/types';
import clinicsData from '@/data/clinics.json';
import Card from '@/components/ui/Card';

export default function AgendamentoPage() {
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [searchCity, setSearchCity] = useState('');

  const clinics = clinicsData as Clinic[];
  const filteredClinics = searchCity
    ? clinics.filter((c) => c.cidade.toLowerCase().includes(searchCity.toLowerCase()))
    : clinics;

  if (selectedClinic) {
    return (
      <div className="space-y-4">
        <StepProgress currentStep={5} />
        <BookingForm clinic={selectedClinic} onBack={() => setSelectedClinic(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <StepProgress currentStep={5} />

      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900">Encontre uma clínica</h1>
        <p className="text-sm text-gray-500 mt-1">
          Clínicas credenciadas perto de você
        </p>
      </div>

      {/* Search */}
      <Card>
        <input
          type="text"
          placeholder="Buscar por cidade..."
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
        />
      </Card>

      {/* Clinic list */}
      {filteredClinics.length > 0 ? (
        <ClinicList clinics={filteredClinics} onSelect={setSelectedClinic} />
      ) : (
        <Card className="text-center space-y-2">
          <p className="text-gray-500 text-sm">Nenhuma clínica encontrada nessa cidade.</p>
          <p className="text-gray-400 text-xs">Tente outra cidade ou limpe a busca.</p>
        </Card>
      )}
    </div>
  );
}
