export interface DemoLessonCard {
  id: string;
  type: 'concept' | 'example' | 'tip' | 'warning' | 'visual';
  title: string;
  content: string;
}

export interface DemoQuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctOption: number;
  explanation: string;
}

export interface DemoLessonContent {
  title: string;
  subtitle: string;
  objective: string;
  durationLabel: string;
  questionsLabel: string;
  xpRewardLabel: string;
  masteryThreshold: number;
  cards: DemoLessonCard[];
  questions: DemoQuizQuestion[];
}

export const demoLessonContent: DemoLessonContent = {
  title: 'Flujo de Caja 101',
  subtitle: 'Visualiza el dinero que entra y sale para tomar mejores decisiones.',
  objective: 'Identificar entradas y salidas clave y construir un mini flujo semanal.',
  durationLabel: '5-7 min',
  questionsLabel: '3 preguntas',
  xpRewardLabel: '+15 XP base',
  masteryThreshold: 70,
  cards: [
    {
      id: 'card-1',
      type: 'concept',
      title: '¿Qué es el flujo de caja?',
      content: 'Es el registro de cómo entra y sale tu dinero. Te dice si puedes cubrir gastos sin quedarte corto.',
    },
    {
      id: 'card-2',
      type: 'example',
      title: 'Ejemplo rápido',
      content: 'Ingreso: $900. Gastos fijos: $520. Gastos variables: $220. Resultado: +$160. Hay espacio para ahorro.',
    },
    {
      id: 'card-3',
      type: 'tip',
      title: 'Tip: fija un “mínimo de seguridad”',
      content: 'Reserva un mínimo semanal para imprevistos. Así evitas romper tu racha y mantener liquidez.',
    },
  ],
  questions: [
    {
      id: 'q1',
      prompt: '¿Cuál es el objetivo principal de un flujo de caja?',
      options: [
        'Reemplazar tu presupuesto anual',
        'Medir entradas y salidas para evitar quedarte corto',
        'Calcular impuestos automáticamente',
        'Registrar solo los gastos fijos',
      ],
      correctOption: 1,
      explanation: 'El flujo de caja muestra entradas y salidas para saber si puedes cubrir gastos y tomar decisiones.',
    },
    {
      id: 'q2',
      prompt: 'Si tienes $900 de ingreso y $740 de gastos, ¿cuál es tu resultado?',
      options: ['$160', '$120', '$60', '$0'],
      correctOption: 0,
      explanation: '900 - 740 = 160. Es superávit, puedes decidir si ahorrar o invertir.',
    },
    {
      id: 'q3',
      prompt: '¿Por qué tener un “mínimo de seguridad” semanal?',
      options: [
        'Para gastar más en ocio',
        'Para evitar uso de tarjetas',
        'Para cubrir imprevistos sin perder liquidez',
        'Para calcular impuestos',
      ],
      correctOption: 2,
      explanation: 'Ese fondo evita que un imprevisto rompa tu flujo y tu racha.',
    },
  ],
};
