import { InputNumber, InputNumberProps } from 'antd';
import React from 'react';
import './index.less';

interface DigitRangProps {
  value?: any;
  minProps?: InputNumberProps;
  maxProps?: InputNumberProps;
  onChange?: (value: any) => void;
  extra?: [any, any, any];
}

export default function (props: DigitRangProps) {
  const {
    minProps,
    maxProps,
    value = [],
    onChange,
    extra = ['', '~', ''],
  } = props;
  const onChangeNumber = (type: any, num: any) => {
    const newNum: any = [];
    if (type === 'min') {
      newNum.push(num);
      newNum.push(value[1]);
    }
    if (type === 'max') {
      newNum.push(value[0]);
      newNum.push(num);
    }
    onChange?.(newNum);
  };

  return (
    <div className="digitRangBox">
      <div className="extra">{extra[0]}</div>
      <InputNumber
        className="inputNumber"
        {...minProps}
        value={value[0]}
        onChange={(min) => onChangeNumber('min', min)}
      />
      <div className="extra">{extra[1]}</div>
      <InputNumber
        className="inputNumber"
        {...maxProps}
        value={value[1]}
        onChange={(max) => onChangeNumber('max', max)}
      />
      <div className="extra">{extra[2]}</div>
    </div>
  );
}
