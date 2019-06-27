import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

/**
 * This will require and make global all components starting with **Base** (e.g BaseButton, BaseInput etc) or **Icon** (e.g IconPhone)
 */
const requireComponent = require.context(
  // The relative path of the components folder
  '../components',
  // Whether or not to look in subfolders
  true,
  // The regular expression used to match base component filenames
  /(Base|Icon)[A-Z]\w+\.(vue|js|svg)$/
)

requireComponent.keys().forEach(fileName => {
  // Get component config
  const componentConfig = requireComponent(fileName)

  // Get PascalCase name of component
  const componentName = upperFirst(
    camelCase(
      // Gets the file name regardless of folder depth
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )


  // Register component globally
  Vue.component(
    componentName,
    // Look for the component options on `.default`, which will
    // exist if the component was exported with `export default`,
    // otherwise fall back to module's root.
    componentConfig.default || componentConfig
  )
})
