export class BusinessException extends Error {
  name: string

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

/** [400] Throw when a user does not pass the essential parameter. */
export class EmptyParameterException extends BusinessException {
  constructor(credential) {
    super(`${credential} is empty`)
  }
}

/** [400] Throw when a user pass the invalid parameter. */
export class ParameterValidationException extends BusinessException {
  constructor(entity) {
    super(entity)
  }
}

/** [401] Throw when a user cannot be identified with given credential. */
export class UnidentifiedException extends BusinessException {
  constructor(credential) {
    super(`Incorrect ${credential}`)
  }
}

export class UnverifiedException extends BusinessException {
  constructor(credential) {
    super(`Unverified account ${credential}`)
  }
}

/** [401] Throw when JWT token is invalid. */
export class InvalidJwtTokenException extends BusinessException {
  constructor(message) {
    super(`Invalid token: ${message}`)
  }
}

/** [403] Throw when request cannot be carried due to lack of permission. */
export class ForbiddenAccessException extends BusinessException {}

/** [404] Throw when requested entity is not found. */
export class EntityNotExistException extends BusinessException {
  constructor(entity) {
    super(`${entity} does not exist`)
  }
}

/** [409] Throw when the request has a conflict with relevant entities.
 */
export class ConflictFoundException extends BusinessException {
  constructor(entity) {
    super(`${entity} is already exists`)
  }
}

/** [409] Throw when the request has a conflict with relevant entities.
 */
export class DuplicateFoundException extends ConflictFoundException {
  constructor(entity) {
    super(`${entity} is already in use`)
  }
}

/** [422] Throw when data is invalid or cannot be processed. */
export class UnprocessableDataException extends BusinessException {}

/** [422] Throw when file data is invalid or cannot be processed. */
export class UnprocessableFileDataException extends UnprocessableDataException {
  constructor(message, fileName, rowNumber) {
    super(`${message} @${fileName}:${rowNumber}`)
  }
}

/** [500] Cache Exception */
export class CacheException extends BusinessException {
  constructor(error) {
    super(error)
  }
}

/** [500] Database Exception */
export class DatabaseException extends BusinessException {
  constructor(error) {
    super(error)
  }
}

/** [500] Unexpected Exception */
export class UnexpectedException extends BusinessException {
  constructor(error) {
    super(error)
  }
}
