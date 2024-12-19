import {
  SignupFormFirstStepSchema,
  SignupFormThirdSchema,
  ValidationErrors,
} from '@/src/app/lib/definitions';
import { checkIfUserExists } from '@/src/app/actions/signup';

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
        stepErrors[issue.path[0]] = issue.message;
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

export const validateThridStep = (t: any, companyData: any, formData: any): ValidationErrors => {
  if (!formData.asCompany) {
    return {};
  }
  try {
    SignupFormThirdSchema(t).parse(companyData);
    formData.company = companyData;
    return {};
  } catch (error: any) {
    const stepErrors: ValidationErrors = {};
    error.errors.forEach((issue: any) => {
      stepErrors[issue.path[0]] = issue.message;
    });
    return stepErrors;
  }
};

export const validateFourthStep = (t: any, formData: any): ValidationErrors => {
  if (!formData.isStatuteAccepted) {
    return { isStatuteAccepted: t('acceptStatute') };
  }
  return {};
};
