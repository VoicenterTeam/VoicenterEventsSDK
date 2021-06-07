import { extend } from 'vee-validate'
import { email, required, min_value, max_value } from 'vee-validate/dist/rules'

extend('required', required)
extend('email', email)
extend('min_value', min_value)
extend('max_value', max_value)
