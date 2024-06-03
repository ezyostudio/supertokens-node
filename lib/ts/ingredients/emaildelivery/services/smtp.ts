/* Copyright (c) 2021, VRAI Labs and/or its affiliates. All rights reserved.
 *
 * This software is licensed under the Apache License, Version 2.0 (the
 * "License") as published by the Apache Software Foundation.
 *
 * You may not use this file except in compliance with the License. You may
 * obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
import OverrideableBuilder from "supertokens-js-override";
import { UserContext } from "../../../types";

export interface SMTPServiceConfig {
    host: string;
    from: {
        name: string;
        email: string;
    };
    port: number;
    secure?: boolean;
    authUsername?: string;
    password: string;
}

export interface GetContentResult {
    body: string;
    isHtml: boolean;
    subject: string;
    toEmail: string;
}

export type TypeInputSendRawEmail = GetContentResult & { userContext: UserContext };

export type ServiceInterface<T> = {
    sendRawEmail: (input: TypeInputSendRawEmail) => Promise<void>;
    getContent: (input: T & { userContext: UserContext }) => Promise<GetContentResult>;
};

export type TypeInput<T> = {
    smtpSettings: SMTPServiceConfig;
    override?: (oI: ServiceInterface<T>, builder: OverrideableBuilder<ServiceInterface<T>>) => ServiceInterface<T>;
};
