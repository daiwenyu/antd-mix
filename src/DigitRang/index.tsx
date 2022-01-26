import React from 'react';
import { InputNumber, InputNumberProps } from 'antd';
import './index.less';

interface DigitRangProps {
  value?: any;
  minProps?: InputNumberProps;
  maxProps?: InputNumberProps;
  onChange?: (value: any) => void;
}

export default function (props: DigitRangProps) {
  const { minProps, maxProps, value = [], onChange } = props;
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
      <InputNumber
        style={{ flex: 1 }}
        {...minProps}
        value={value[0]}
        onChange={(min) => onChangeNumber('min', min)}
      />
      <div className="digitRangDot">~</div>
      <InputNumber
        style={{ flex: 1 }}
        {...maxProps}
        value={value[1]}
        onChange={(max) => onChangeNumber('max', max)}
      />
    </div>
  );
}
