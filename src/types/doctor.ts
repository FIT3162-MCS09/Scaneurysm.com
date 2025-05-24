// Doctor patient interface
export interface DoctorPatient {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  dateOfBirth?: string;
  lastVisit?: string;
  medicalRecordNumber?: string;
  latestPrediction?: {
    result: string;
    confidence: number;
  };
}
