import {
  Company,
  SignupFormData,
  SignupFormFirstStepSchema,
  SignupFormThirdSchema,
  ValidationErrors,
} from '@/src/app/lib/definitions';
import { checkIfUserExists } from '@/src/app/lib/actions';

export const validateFirstStep = async (t: any, formData: any): Promise<ValidationErrors> => {
  try {
    SignupFormFirstStepSchema(t).parse(formData);
    const emailExistsErrors = await checkIfUserExists(formData);
    if (emailExistsErrors.email) {
      return emailExistsErrors;
    }

    return {};
  } catch (error: any) {
    const stepErrors: ValidationErrors = {};
    error.errors.forEach((issue: any) => {
      if (issue.path[0] === 'password') {
        if (!Array.isArray(stepErrors.password)) {
          stepErrors.password = [];
        }
        if (Array.isArray(stepErrors.password)) {
          stepErrors.password.push(issue.message);
        }
      } else {
        stepErrors[issue.path[0] as keyof ValidationErrors] = issue.message;
      }
    });
    return stepErrors;
  }
};

export const validateSecondStep = (t: any, formData: any): ValidationErrors => {
  if (!formData.accountType) {
    const stepErrors: ValidationErrors = {};
    stepErrors.accountType = t('selectAccountType');
    return stepErrors;
  }
  return {};
};

export const validateThridStep = (
  t: any,
  companyData: Company,
  formData: SignupFormData,
): ValidationErrors => {
  if (formData.asCompany == null) {
    return { asCompany: t('selectEntityType') };
  }

  const result = SignupFormThirdSchema(t).safeParse(companyData);

  if (result.success) {
    formData.company = companyData;
    return {};
  }

  const stepErrors: ValidationErrors = {};

  result.error.issues.forEach((issue) => {
    if (issue.path.length > 1) {
      const [parent, child] = issue.path;
      if (parent === 'address') {
        if (!stepErrors.address) {
          stepErrors.address = {};
        }

        if (child === 'city' || child === 'postalCode' || child === 'street') {
          stepErrors.address[child] = issue.message;
        }
      }
    } else {
      stepErrors[issue.path[0] as keyof ValidationErrors] = issue.message;
    }
  });

  console.log(stepErrors);
  return stepErrors;
};

export const validateFourthStep = (t: any, formData: SignupFormData): ValidationErrors => {
  if (!formData.isStatuteAccepted) {
    return { isStatuteAccepted: t('acceptStatute') };
  }
  return {};
};
