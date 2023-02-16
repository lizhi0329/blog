import _ from 'lodash';
import { add } from './add';
import { sub } from './sub';
import './index.css';

const addResult = add(56 + 211);
const subResult = sub(213 - 53);
console.log(_.join([addResult, subResult], '---'));

const box = document.createElement('div');
box.innerText = 'compare hash';
document.body.append(box);