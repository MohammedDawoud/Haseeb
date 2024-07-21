import { Auditable } from './auditable';

export class Guide_QuestionsAnswers extends Auditable {
  guide_QuestionsAnswersId: number;
  questionAr: string | null;
  questionEn: string | null;
  answersAr: string | null;
  answersEn: string | null;
}
