const profile = {
  id: 'profile-ana',
  full_name: 'Ana Souza',
  is_primary: true,
  is_dependent: false,
  can_switch_profile: true,
  avatar_url: null,
  share_history_with_doctors: true,
};

export const ana = {
  id: 'user-ana',
  name: 'Ana Souza',
  email: 'ana.souza@email.com',
  user_type: 'client',
  profile,
  available_profiles: [profile],
};

export const specialties = ['Clínico Geral', 'Psicologia', 'Nutrição', 'Dermatologia', 'Pediatria', 'Cardiologia', 'Ginecologia', 'Ortopedia'].map((name, index) => ({ id: String(index + 1), name }));

export const patientQueries = [
  { key: ['userProfile'], data: ana },
  { key: ['specialties'], data: specialties },
  { key: ['/notifications/unread-count/'], data: { count: 2 } },
];
