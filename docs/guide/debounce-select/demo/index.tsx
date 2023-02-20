import React, { useEffect } from 'react';
import { DebounceSelect } from 'antd-mix';

interface UserValue {
  label: string;
  value: string;
}

async function fetchUserList(username: string): Promise<UserValue[]> {
  // console.log('fetching user', username);
  return fetch('https://randomuser.me/api/?results=5')
    .then((response) => response.json())
    .then((body) =>
      body.results.map(
        (user: {
          name: { first: string; last: string };
          login: { username: string };
        }) => ({
          label: `${user.name.first} ${user.name.last}`,
          value: user.login.username,
        }),
      ),
    );
}

export default function () {
  // const [value, setValue] = React.useState<UserValue[]>();
  const [value, setValue] = React.useState();

  return (
    <DebounceSelect
      // mode="multiple"
      showSearch
      value={value}
      placeholder="Select users"
      fetchOptions={fetchUserList}
      onChange={(newValue) => {
        console.log(newValue);
        setValue(newValue);
      }}
      style={{ width: '100%' }}
    />
  );
}
