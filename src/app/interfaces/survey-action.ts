import { Cooldown } from "./cooldown";
import { Survey } from "./survey";

export interface SurveyAction {
    cooldown: Cooldown
    surveys: Survey[]
}
