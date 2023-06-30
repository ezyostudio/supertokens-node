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

import { NormalisedAppinfo } from "../../types";
import { RecipeInterface, APIInterface, TypeProvider } from "./types";
import { TypeInput, TypeNormalisedInput, TypeInputSignInAndUp, TypeNormalisedInputSignInAndUp } from "./types";

export function validateAndNormaliseUserInput(appInfo: NormalisedAppinfo, config: TypeInput): TypeNormalisedInput {
    let signInAndUpFeature = validateAndNormaliseSignInAndUpConfig(appInfo, config.signInAndUpFeature);

    let override = {
        functions: (originalImplementation: RecipeInterface) => originalImplementation,
        apis: (originalImplementation: APIInterface) => originalImplementation,
        ...config.override,
    };

    return {
        signInAndUpFeature,
        override,
    };
}

export async function findRightProvider(
    providers: TypeProvider[],
    thirdPartyId: string,
    clientId?: string
): Promise<TypeProvider | undefined> {
    for (const p of providers) {
        let id = p.id;
        if (id !== thirdPartyId) {
            continue;
        }

        // first if there is only one provider with thirdPartyId in the providers array,
        let otherProvidersWithSameId = providers.filter((p1) => p1.id === id && p !== p1);
        if (otherProvidersWithSameId.length === 0) {
            // they we always return that.
            return p;
        }

        // otherwise, we look for the isDefault provider if clientId is missing
        if (clientId === undefined && p.isDefault === true) {
            return p;
        }

        // otherwise, we return a provider that matches based on client ID as well.
        if ((await p.get(undefined, undefined, {})).getClientId({}) === clientId) {
            return p;
        }
    }
    return undefined;
}

function validateAndNormaliseSignInAndUpConfig(
    _: NormalisedAppinfo,
    config: TypeInputSignInAndUp
): TypeNormalisedInputSignInAndUp {
    let providers = config.providers;

    if (providers === undefined || providers.length === 0) {
        throw new Error(
            "thirdparty recipe requires atleast 1 provider to be passed in signInAndUpFeature.providers config"
        );
    }

    // we check if there are multiple providers with the same id that have isDefault as true.
    // In this case, we want to throw an error..
    let isDefaultProvidersSet = new Set<string>();
    let allProvidersSet = new Set<string>();
    providers.forEach((p) => {
        let id = p.id;
        allProvidersSet.add(p.id);
        let isDefault = p.isDefault;

        if (isDefault === undefined) {
            // if this id is not being used by any other provider, we treat this as the isDefault
            let otherProvidersWithSameId = providers.filter((p1) => p1.id === id && p !== p1);
            if (otherProvidersWithSameId.length === 0) {
                // we treat this as the isDefault now...
                isDefault = true;
            }
        }
        if (isDefault) {
            if (isDefaultProvidersSet.has(id)) {
                throw new Error(
                    `You have provided multiple third party providers that have the id: "${id}" and are marked as "isDefault: true". Please only mark one of them as isDefault.`
                );
            }
            isDefaultProvidersSet.add(id);
        }
    });

    if (isDefaultProvidersSet.size !== allProvidersSet.size) {
        // this means that there is no provider marked as isDefault
        throw new Error(
            `The providers array has multiple entries for the same third party provider. Please mark one of them as the default one by using "isDefault: true".`
        );
    }

    return {
        providers,
    };
}
