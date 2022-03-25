import { AnswerVote } from "./AnswerVote";
import { User } from "./User";

export interface Answer{
    id: string,
    author: User,
    question: string,
    answer: string,
    upvotes: AnswerVote[]
}