import { registerDecorator, type ValidationArguments, type ValidationOptions } from "class-validator";

export function IsValidPassword(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: "isValidPassword",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== "string" || value.length < 8) {
            return false;
          }

          /*
            1. Has a minimum length of 8 characters.
            2. Is alphanumeric and contains at least one symbol.
            3. Contains at least one uppercase letter and one lowercase letter.
          */
          // const regex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);
          const regex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/);
          if (!regex.test(value)) {
            return false;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid password with a minimum length of 8 characters, containing at least one uppercase letter, one lowercase letter, one number, and one special character.`;
        },
      },
    });
  };
}
