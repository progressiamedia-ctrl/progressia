import { DemoLessonExperience } from '@/components/onboarding/DemoLessonExperience';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { demoLessonContent } from '@/app/welcome/demoLessonContent';

export const metadata = {
  title: 'Demo Lesson - Progressia',
  description: 'Prueba la lección demo antes de registrarte.',
};

export default function DemoLessonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background-primary via-background-secondary to-background-primary text-text-primary">
      <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase text-text-secondary">Lección demo</span>
              <h1 className="text-3xl font-bold text-text-primary">{demoLessonContent.title}</h1>
              <p className="text-sm text-text-secondary">
                Explora las cards y el quiz antes de crear tu cuenta. Guardaremos tu resultado localmente y podrás
                registrarte para conservarlo.
              </p>
            </div>
          </CardHeader>
          <CardBody>
            <DemoLessonExperience lesson={demoLessonContent} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
