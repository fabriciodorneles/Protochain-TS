/*
 * Validation class
 */
export default class Validation {
  success: boolean
  message: string

  /**
   * Create a new validation result
   * @param success - Result of the validation
   * @param message - Message of the validation, if failed
   * @returns A new validation result
   * @constructor
   * @example
   * const validation = new Validation(true, 'Validation successful')
   * console.log(validation.success) // true
   * console.log(validation.message) // 'Validation successful'
   */
  constructor(success: boolean = true, message: string = '') {
    this.success = success
    this.message = message
  }
}
