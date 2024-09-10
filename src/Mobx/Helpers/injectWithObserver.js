import { inject, observer } from 'mobx-react';

export default function (component) {
  return inject((props) => (props))(observer(component));
}
