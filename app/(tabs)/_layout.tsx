import { Tabs } from 'expo-router'
import React from 'react'

const _layout = () => {
  return (
   <Tabs>
    <Tabs.Screen
        name="profile"
        options={{headerShown: false}}>
    </Tabs.Screen>
    <Tabs.Screen
        name="remote"
        options={{headerShown: false}}>
    </Tabs.Screen>
   </Tabs>
  )
}

export default _layout