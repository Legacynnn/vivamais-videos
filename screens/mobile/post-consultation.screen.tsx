import { PostConsultationScreen } from '~/components/consultation/post/PostConsultationScreen';

import { helena, postConsultationQueries } from '@screens/fixtures/helena';

export const meta = { title: 'Pós-consulta', route: '(client)/post-consultation' };

const post = (ready: boolean) => ({ user: helena, queries: postConsultationQueries(ready), props: { consultationId: 'consult-helena' } });

export const states = { preparing: post(false), ready: post(true) };

export default PostConsultationScreen;
