// @ts-nocheck
import { TypeInput } from "../../../../../ingredients/emaildelivery/services/smtp";
import { EmailDeliveryInterface } from "../../../../../ingredients/emaildelivery/types";
import { TypeThirdPartyEmailPasswordEmailDeliveryInput } from "../../../types";
export default class SMTPService implements EmailDeliveryInterface<TypeThirdPartyEmailPasswordEmailDeliveryInput> {
    private emailPasswordSMTPService;
    constructor(config: TypeInput<TypeThirdPartyEmailPasswordEmailDeliveryInput>);
    sendEmail: (
        input: TypeThirdPartyEmailPasswordEmailDeliveryInput & {
            userContext: any;
        }
    ) => Promise<void>;
}
