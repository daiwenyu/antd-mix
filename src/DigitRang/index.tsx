import React from 'react';
import { InputNumber, InputNumberProps } from 'antd';
import './index.less';

interface DigitRangProps {
  value?: undefined | [number | undefined, number | undefined];
  minProps?: InputNumberProps;
  maxProps?: InputNumberProps;
  onChange?: (
    value: [number | undefined, number | undefined] | undefined,
  ) => void;
}

export default function (props: DigitRangProps) {
  const { minProps, maxProps, value = [], onChange } = props;
  const onChangeNumber = (type, num) => {
    const newNum = [];
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
