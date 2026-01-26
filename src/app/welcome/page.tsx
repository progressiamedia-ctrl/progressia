import Link from 'next/link';
import type { ReactNode } from 'react';
import { DemoLessonExperience } from '@/components/onboarding/DemoLessonExperience';
import { Button, Card, CardBody, CardFooter, CardHeader } from '@/components/ui';
import { demoLessonContent } from './demoLessonContent';

export const metadata = {
  title: 'Bienvenido a Progressia',
  description: 'Prueba la lección demo antes de crear tu cuenta.',
};

const states = [
  { title: 'Cargando', desc: 'Mostramos skeletons de tarjetas y botones.' },
  { title: 'Error', desc: 'Mensaje claro y opción de reintentar.' },
  { title: 'Vacío', desc: 'Fallback con CTA a la demo cuando no hay datos.' },
];

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background-primary via-background-secondary to-background-primary text-text-primary">
      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-10">
        <header className="flex flex-col gap-6">
          <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase text-text-secondary">
            <span className="px-3 py-1 rounded-full bg-surface-hover border border-border">Feature F001</span>
            <span className="px-3 py-1 rounded-full bg-surface-hover border border-border">Demo antes de registro</span>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary">
              Entra, prueba una lección demo, decide si te quedas
            </h1>
            <p className="text-lg text-text-secondary max-w-3xl">
              Micro-lecciones de 5-10 minutos, progreso visible desde el primer día y gamificación que mantiene tu racha viva.
              No necesitas tarjeta para empezar.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <AnchorButton href="/signup" variant="primary" fullWidth>
              Crear cuenta
            </AnchorButton>
            <AnchorButton href="/login" variant="outline" fullWidth>
              Ya tengo cuenta
            </AnchorButton>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Card>
              <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase text-text-secondary">Lección demo</span>
                  <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">{demoLessonContent.title}</h2>
                  <p className="text-sm text-text-secondary">{demoLessonContent.subtitle}</p>
                </div>
                <div className="flex items-center gap-2 text-xs flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-surface-hover border border-border text-text-primary">
                    {demoLessonContent.durationLabel}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-surface-hover border border-border text-text-primary">
                    {demoLessonContent.questionsLabel}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#9ACD32]/10 text-primary-500 border border-primary-500/40">
                    {demoLessonContent.xpRewardLabel}
                  </span>
                </div>
              </CardHeader>
              <CardBody className="flex flex-col gap-5">
                <div className="bg-surface-hover border border-border rounded-xl p-4 flex flex-col gap-2">
                  <p className="text-xs font-semibold text-text-secondary uppercase">Primer vistazo</p>
                  <h3 className="text-lg font-semibold text-text-primary">¿Qué es el flujo de caja?</h3>
                  <p className="text-sm text-text-secondary">
                    Aprende a leer tus entradas y salidas de dinero, identifica huecos y planifica tu próxima semana sin
                    sorpresas.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-surface-hover border border-border rounded-xl p-4 flex flex-col gap-2">
                    <p className="text-xs font-semibold text-primary-500 uppercase">Micro-cards</p>
                    <p className="text-sm text-text-secondary">Conceptos, ejemplos y tips listos para repasar.</p>
                  </div>
                  <div className="bg-surface-hover border border-border rounded-xl p-4 flex flex-col gap-2">
                    <p className="text-xs font-semibold text-primary-500 uppercase">Quiz inmediato</p>
                    <p className="text-sm text-text-secondary">Feedback al instante, necesitas 70% para aprobar.</p>
                  </div>
                  <div className="bg-surface-hover border border-border rounded-xl p-4 flex flex-col gap-2">
                    <p className="text-xs font-semibold text-primary-500 uppercase">Recompensas</p>
                    <p className="text-sm text-text-secondary">Suma XP y protege tu racha desde el día uno.</p>
                  </div>
                </div>
              </CardBody>
              <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-text-secondary">
                  No necesitas registrarte para probar la demo. Guarda tu progreso solo cuando crees tu cuenta.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <AnchorButton href="#demo" variant="secondary" fullWidth>
                    Ver demo en modo interactivo
                  </AnchorButton>
                  <AnchorButton href="/lesson/demo" variant="primary" fullWidth>
                    Iniciar demo ahora
                  </AnchorButton>
                </div>
              </CardFooter>
            </Card>

            <div id="demo">
              <DemoLessonExperience lesson={demoLessonContent} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold text-text-primary">Tu viaje diario</h3>
                <p className="text-sm text-text-secondary">Así se ve un día típico en Progressia.</p>
              </CardHeader>
              <CardBody className="flex flex-col gap-3">
                <StepItem title="1. Demo sin fricción" desc="Explora la lección demo sin crear cuenta." />
                <StepItem title="2. Crea tu cuenta" desc="Usa email o Google para guardar tu progreso." />
                <StepItem title="3. Mantén tu racha" desc="Completa la micro-lección diaria y gana XP + monedas." />
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold text-text-primary">Estados cubiertos</h3>
                <p className="text-sm text-text-secondary">Loading, error y vacío listos para la demo.</p>
              </CardHeader>
              <CardBody className="grid grid-cols-1 gap-3">
                {states.map((state) => (
                  <div
                    key={state.title}
                    className="rounded-xl border border-border bg-surface-hover px-4 py-3 flex flex-col gap-1"
                  >
                    <p className="text-sm font-semibold text-text-primary">{state.title}</p>
                    <p className="text-xs text-text-secondary">{state.desc}</p>
                  </div>
                ))}
                <div className="rounded-xl border border-border bg-surface px-4 py-4 flex flex-col gap-3">
                  <p className="text-xs font-semibold text-text-secondary uppercase">Vistas de ejemplo</p>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2 rounded-lg border border-border/60 bg-surface-hover p-3">
                      <span className="text-xs text-text-secondary">Loading</span>
                      <div className="skeleton h-4 w-2/3" />
                      <div className="skeleton h-3 w-1/2" />
                    </div>
                    <div className="flex flex-col gap-2 rounded-lg border border-error/40 bg-error/10 p-3">
                      <span className="text-xs text-text-secondary">Error</span>
                      <p className="text-sm text-text-primary">No pudimos cargar la demo.</p>
                      <Button variant="outline" size="sm" className="w-fit">
                        Reintentar
                      </Button>
                    </div>
                    <div className="flex flex-col gap-2 rounded-lg border border-border/60 bg-surface-hover p-3">
                      <span className="text-xs text-text-secondary">Vacío</span>
                      <p className="text-sm text-text-secondary">
                        Sin datos de demo. Mostramos CTA para continuar al registro.
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

interface StepItemProps {
  title: string;
  desc: string;
}

function StepItem({ title, desc }: StepItemProps) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-surface-hover px-4 py-3">
      <p className="text-sm font-semibold text-text-primary">{title}</p>
      <p className="text-xs text-text-secondary">{desc}</p>
    </div>
  );
}

interface AnchorButtonProps {
  href: string;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  children: ReactNode;
}

function AnchorButton({ href, variant = 'primary', fullWidth = false, children }: AnchorButtonProps) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500';
  const size = 'px-6 py-3';
  const width = fullWidth ? 'w-full' : 'w-auto';
  const styles =
    variant === 'primary'
      ? 'bg-primary-500 text-[#0A1628] hover:bg-primary-600 shadow-glow-green'
      : variant === 'secondary'
        ? 'bg-surface text-text-primary border border-border hover:bg-surface-hover hover:shadow-md'
        : 'border border-border text-text-primary hover:bg-surface-hover hover:shadow-md';

  return (
    <Link href={href} className={`${base} ${size} ${width} ${styles}`}>
      {children}
    </Link>
  );
}
