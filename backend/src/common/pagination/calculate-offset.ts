import { ParameterValidationException } from '../exception/business.exception'

export const calculateOffset = (page: number, limit: number) => {
  checkParameters(page, limit)
  return (page - 1) * limit
}

const checkParameters = (page: number, limit: number) => {
  if (page < 1) {
    throw new ParameterValidationException('page')
  }

  if (limit < 1) {
    throw new ParameterValidationException('limit')
  }
}
