export class BusinessException extends Error {
  name: string

  constructor(message: string, stack?: string) {
    super(message)
    this.name = this.constructor.name
    this.stack = stack
  }
}

/** [400] Throw when a user does not pass the essential parameter. */
export class EmptyParameterException extends BusinessException {
  constructor(credential, stack?: string) {
    super(`${credential} is empty`, stack)
  }
}

/** [400] Throw when a user pass the invalid parameter. */
export class ParameterValidationException extends BusinessException {
  constructor(entity, stack?: string) {
    super(entity, stack)
  }
}

/** [401] Throw when a user cannot be identified with given credential. */
export class UnidentifiedException extends BusinessException {
  constructor(credential, stack?: string) {
    super(`Incorrect ${credential}`, stack)
  }
}

export class UnverifiedException extends BusinessException {
  constructor(credential, stack?: string) {
    super(`Unverified account ${credential}`, stack)
  }
}

/** [401] Throw when JWT token is invalid. */
export class InvalidJwtTokenException extends BusinessException {
  constructor(message, stack?: string) {
    super(`Invalid token: ${message}`, stack)
  }
}

/** [403] Throw when request cannot be carried due to lack of permission. */
export class ForbiddenAccessException extends BusinessException {}

/** [404] Throw when requested entity is not found. */
export class EntityNotExistException extends BusinessException {
  constructor(entity, stack?: string) {
    super(`${entity} does not exist`, stack)
  }
}

/** [409] Throw when the request has a conflict with relevant entities.
 */
export class ConflictFoundException extends BusinessException {
  constructor(entity, stack?: string) {
    super(`${entity} is already exists`, stack)
  }
}

/** [409] Throw when the request has a conflict with relevant entities.
 */
export class DuplicateFoundException extends ConflictFoundException {
  constructor(entity, stack?: string) {
    super(`${entity} is already in use`, stack)
  }
}

/** [422] Throw when data is invalid or cannot be processed. */
export class UnprocessableDataException extends BusinessException {}

/** [422] Throw when file data is invalid or cannot be processed. */
export class UnprocessableFileDataException extends UnprocessableDataException {
  constructor(message, fileName, rowNumber, stack?: string) {
    super(`${message} @${fileName}:${rowNumber}`, stack)
  }
}

/** [500] Cache Exception */
export class CacheException extends BusinessException {
  constructor(error, stack?: string) {
    super(error, stack)
  }
}

/** [500] Database Exception */
export class DatabaseException extends BusinessException {
  constructor(error, stack?: string) {
    super(error, stack)
  }
}

/** [500] Unexpected Exception */
export class UnexpectedException extends BusinessException {
  constructor(error, stack?: string) {
    super(error, stack)
  }
}
