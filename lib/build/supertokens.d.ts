import { TypeInput, NormalisedAppinfo, HTTPMethod } from "./types";
import RecipeModule from "./recipeModule";
import * as express from "express";
import NormalisedURLPath from "./normalisedURLPath";
export default class SuperTokens {
    private static instance;
    appInfo: NormalisedAppinfo;
    isInServerlessEnv: boolean;
    recipeModules: RecipeModule[];
    constructor(config: TypeInput);
    sendTelemetry: () => Promise<void>;
    static init(config: TypeInput): void;
    static reset(): void;
    static getInstanceOrThrowError(): SuperTokens;
    middleware: () => (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) => Promise<void>;
    handleAPI: (
        matchedRecipe: RecipeModule,
        id: string,
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
        path: NormalisedURLPath,
        method: HTTPMethod
    ) => Promise<void>;
    errorHandler: () => (
        err: any,
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) => Promise<void>;
    getAllCORSHeaders: () => string[];
    getUserCount: (includeRecipeIds?: string[] | undefined) => Promise<number>;
    getUsers: (input: {
        timeJoinedOrder: "ASC" | "DESC";
        limit?: number | undefined;
        paginationToken?: string | undefined;
        includeRecipeIds?: string[] | undefined;
    }) => Promise<{
        users: {
            recipeId: string;
            user: any;
        }[];
        nextPaginationToken?: string | undefined;
    }>;
}
