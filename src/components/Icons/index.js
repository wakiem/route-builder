import React from 'react';
import { library, icon } from '@fortawesome/fontawesome-svg-core'
import { faTrash, faBars } from '@fortawesome/free-solid-svg-icons'

library.add(faTrash, faBars);

const trashIcon = icon({ prefix: 'fas', iconName: 'trash' });
const barsIcon = icon({ prefix: 'fas', iconName: 'bars' });

export const TrashIcon = (props) => {
  return convert(trashIcon.abstract[0], props);
};

export const BarsIcon = (props) => {
  return convert(barsIcon.abstract[0], props);
};

// UTILS
// Disclaimer: Very (very) strongly inspired by https://github.com/FortAwesome/react-fontawesome

function _isNumerical(obj) {
  obj = obj - 0

  // eslint-disable-next-line no-self-compare
  return obj === obj
}

function camelize(string) {
  if (_isNumerical(string)) {
    return string
  }

  // eslint-disable-next-line no-useless-escape
  string = string.replace(/[\-_\s]+(.)?/g, function (match, chr) {
    return chr ? chr.toUpperCase() : ''
  })

  // Ensure 1st char is always lowercase
  return string.substr(0, 1).toLowerCase() + string.substr(1)
}

function convert(element, extraProps = {}) {
  if (typeof element === 'string') {
    return element
  }

  const children = (element.children || []).map(child => {
    return convert(child)
  })

  const mixins = Object.keys(element.attributes || {}).reduce(
    (acc, key) => {
      const val = element.attributes[key]

      if (key === 'class') {
        acc.attrs['className'] = val;
        delete element.attributes['class'];
      } else if (key.indexOf('aria-') === 0 || key.indexOf('data-') === 0) {
        acc.attrs[key.toLowerCase()] = val
      } else {
        acc.attrs[camelize(key)] = val
      }

      return acc
    },
    { attrs: {} }
  )

  const { style: existingStyle = {}, ...remaining } = extraProps

  mixins.attrs['style'] = { ...mixins.attrs['style'], ...existingStyle }

  return React.createElement(
    element.tag,
    { ...mixins.attrs, ...remaining },
    ...children
  )
}