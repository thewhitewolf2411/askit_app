import { Answer } from "./Answers";
import { User } from "./User";

export interface Question{
    id: string,
    author: User,
    question: string,
    answers: Answer[],
    upvotes: []
}