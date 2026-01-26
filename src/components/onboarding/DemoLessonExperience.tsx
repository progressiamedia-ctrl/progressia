'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, CardFooter, CardHeader } from '@/components/ui';
import type { DemoLessonContent } from '@/app/welcome/demoLessonContent';

type Phase = 'intro' | 'cards' | 'quiz' | 'result';

interface DemoLessonExperienceProps {
  lesson: DemoLessonContent;
}

export function DemoLessonExperience({ lesson }: DemoLessonExperienceProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [cardIndex, setCardIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedProgress, setSavedProgress] = useState<{ percent: number; correct: number; total: number } | null>(null);

  const currentCard = lesson.cards[cardIndex];
  const currentQuestion = lesson.questions[questionIndex];

  const score = useMemo(() => {
    const correct = lesson.questions.reduce((acc, question) => {
      return acc + (answers[question.id] === question.correctOption ? 1 : 0);
    }, 0);
    const percent = Math.round((correct / lesson.questions.length) * 100);
    return {
      correct,
      percent,
      passed: percent >= lesson.masteryThreshold,
    };
  }, [answers, lesson.masteryThreshold, lesson.questions]);

  const hasEmptyData = lesson.cards.length === 0 || lesson.questions.length === 0;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem('demoProgress');
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { percent: number; correct: number; total: number };
        setSavedProgress(parsed);
      } catch (err) {
        console.error('Failed to parse saved demo progress', err);
      }
    }
  }, []);

  const handleStart = () => {
    setError(null);
    setIsLoading(true);
    setPhase('intro');
    setTimeout(() => {
      setIsLoading(false);
      setPhase(hasEmptyData ? 'intro' : 'cards');
    }, 450);
  };

  const handleRetry = () => {
    setError(null);
    setAnswers({});
    setCardIndex(0);
    setQuestionIndex(0);
    setPhase('intro');
    handleStart();
  };

  const handleNextCard = () => {
    if (cardIndex < lesson.cards.length - 1) {
      setCardIndex((prev) => prev + 1);
    } else {
      setPhase('quiz');
    }
  };

  const handleAnswer = (optionIndex: number) => {
    if (!currentQuestion) return;

    const nextAnswers = { ...answers, [currentQuestion.id]: optionIndex };
    setAnswers(nextAnswers);

    const isLastQuestion = questionIndex === lesson.questions.length - 1;
    if (isLastQuestion) {
      const correctCount = lesson.questions.reduce((acc, question) => {
        const isCurrent = question.id === currentQuestion.id;
        const selectedIndex = isCurrent ? optionIndex : nextAnswers[question.id];
        return acc + (selectedIndex === question.correctOption ? 1 : 0);
      }, 0);
      const percent = Math.round((correctCount / lesson.questions.length) * 100);
      setPhase('result');
      if (typeof window !== 'undefined') {
        const payload = { percent, correct: correctCount, total: lesson.questions.length };
        localStorage.setItem('demoProgress', JSON.stringify(payload));
        setSavedProgress(payload);
      }
    } else {
      setQuestionIndex((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCardIndex(0);
    setQuestionIndex(0);
    setPhase('intro');
    setIsLoading(false);
    setError(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('demoProgress');
      setSavedProgress(null);
    }
  };

  if (error) {
    return (
      <Card>
        <CardBody className="flex flex-col gap-3">
          <p className="text-text-primary font-semibold">No pudimos cargar la demo.</p>
          <p className="text-sm text-text-secondary">{error}</p>
          <Button variant="outline" size="sm" className="w-fit" onClick={handleRetry}>
            Reintentar
          </Button>
        </CardBody>
      </Card>
    );
  }

  if (hasEmptyData) {
    return (
      <Card>
        <CardBody className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-text-primary">Demo no disponible</p>
          <p className="text-xs text-text-secondary">
            No hay tarjetas o preguntas cargadas. Intenta mas tarde o crea tu cuenta para ver el contenido completo.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase text-text-secondary">Demo interactiva</span>
            <h3 className="text-xl font-semibold text-text-primary">{lesson.objective}</h3>
            {savedProgress && (
              <p className="text-xs text-text-secondary">
                Progreso guardado localmente: {savedProgress.percent}% ({savedProgress.correct}/
                {savedProgress.total} correctas)
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Badge>{lesson.durationLabel}</Badge>
            <Badge>{lesson.questionsLabel}</Badge>
            <Badge tone="primary">{lesson.xpRewardLabel}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardBody className="flex flex-col gap-4">
        {isLoading && <LoadingState />}

        {!isLoading && phase === 'intro' && (
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-hover p-4">
            <p className="text-sm text-text-secondary">
              Explora 3 micro-cards y responde 3 preguntas. Necesitas {lesson.masteryThreshold}% para aprobar.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="primary" size="md" onClick={() => setPhase('cards')}>
                Iniciar demo
              </Button>
              <Button variant="secondary" size="md" onClick={handleStart}>
                Ver loading
              </Button>
            </div>
          </div>
        )}

        {!isLoading && phase === 'cards' && currentCard && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span className="uppercase font-semibold">{currentCard.type}</span>
              <span>
                {cardIndex + 1} de {lesson.cards.length}
              </span>
            </div>
            <div className="rounded-2xl border border-border bg-surface-hover p-4 flex flex-col gap-2">
              <h4 className="text-lg font-semibold text-text-primary">{currentCard.title}</h4>
              <p className="text-sm text-text-secondary">{currentCard.content}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="primary" size="md" onClick={handleNextCard} className="w-full sm:w-auto">
                {cardIndex === lesson.cards.length - 1 ? 'Ir al quiz' : 'Siguiente card'}
              </Button>
              <Button variant="ghost" size="md" onClick={handleReset}>
                Reiniciar
              </Button>
            </div>
          </div>
        )}

        {!isLoading && phase === 'quiz' && currentQuestion && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span className="uppercase font-semibold">Quiz</span>
              <span>
                {questionIndex + 1} de {lesson.questions.length}
              </span>
            </div>
            <div className="rounded-2xl border border-border bg-surface-hover p-4 flex flex-col gap-3">
              <h4 className="text-lg font-semibold text-text-primary">{currentQuestion.prompt}</h4>
              <div className="flex flex-col gap-2">
                {currentQuestion.options.map((option, idx) => {
                  const selected = answers[currentQuestion.id] === idx;
                  const isCorrect = currentQuestion.correctOption === idx;
                  const showState = answers[currentQuestion.id] !== undefined;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleAnswer(idx)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 ${
                        selected
                          ? isCorrect
                            ? 'border-primary-500 bg-primary-500/10 text-text-primary'
                            : 'border-error bg-error/10 text-text-primary'
                          : 'border-border bg-surface hover:bg-surface-hover'
                      }`}
                      disabled={showState}
                    >
                      <span className="text-sm">{option}</span>
                    </button>
                  );
                })}
              </div>
              {answers[currentQuestion.id] !== undefined && (
                <div
                  className={`rounded-lg px-3 py-2 text-sm ${
                    answers[currentQuestion.id] === currentQuestion.correctOption
                      ? 'bg-primary-500/10 text-text-primary border border-primary-500/40'
                      : 'bg-error/10 text-text-primary border border-error/40'
                  }`}
                >
                  {currentQuestion.explanation}
                </div>
              )}
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    if (questionIndex === lesson.questions.length - 1) {
                      setPhase('result');
                    } else {
                      setQuestionIndex((prev) => prev + 1);
                    }
                  }}
                  disabled={answers[currentQuestion.id] === undefined}
                >
                  {questionIndex === lesson.questions.length - 1 ? 'Ver resultados' : 'Siguiente pregunta'}
                </Button>
                <Button variant="ghost" size="md" onClick={handleReset}>
                  Reiniciar
                </Button>
              </div>
            </div>
          </div>
        )}

        {!isLoading && phase === 'result' && (
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-hover p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase text-text-secondary font-semibold">Resultado demo</span>
                <p className="text-lg font-semibold text-text-primary">
                  {score.percent}% · {score.correct}/{lesson.questions.length} correctas
                </p>
                <p className="text-sm text-text-secondary">
                  {score.passed
                    ? 'Bien! Ya puedes crear tu cuenta y guardar tu progreso.'
                    : 'Puedes reintentar la demo o crear tu cuenta para ver mas lecciones.'}
                </p>
              </div>
              <Badge tone={score.passed ? 'primary' : 'neutral'}>{score.passed ? 'Aprobado' : 'Reintenta'}</Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="primary" size="md" className="w-full sm:w-auto" onClick={() => router.push('/signup')}>
                Crear cuenta y guardar progreso
              </Button>
              <Button variant="secondary" size="md" className="w-full sm:w-auto" onClick={handleReset}>
                Repetir demo
              </Button>
            </div>
          </div>
        )}
      </CardBody>

      <CardFooter className="flex flex-col gap-2">
        <p className="text-sm text-text-secondary">
          Tu progreso demo no se guarda hasta que crees tu cuenta. Puedes saltar a Login si ya eres usuario.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>
            Ir a Login
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Reiniciar demo
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setError('Simulacion de error de carga')}>
            Simular error
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function LoadingState() {
  return (
    <div className="rounded-2xl border border-border bg-surface-hover p-4 flex flex-col gap-3">
      <div className="skeleton h-4 w-24" />
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-5/6" />
      <div className="flex gap-3 pt-2">
        <div className="skeleton h-10 w-28 rounded-xl" />
        <div className="skeleton h-10 w-28 rounded-xl" />
      </div>
    </div>
  );
}

interface BadgeProps {
  children: string;
  tone?: 'primary' | 'neutral';
}

function Badge({ children, tone = 'neutral' }: BadgeProps) {
  const styles =
    tone === 'primary'
      ? 'bg-[#9ACD32]/10 text-primary-500 border border-primary-500/50'
      : 'bg-surface-hover text-text-primary border border-border';
  return <span className={`text-xs font-semibold px-3 py-1 rounded-full ${styles}`}>{children}</span>;
}
