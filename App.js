import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView, StatusBar, useWindowDimensions } from 'react-native';

const buttonMargin = 10;

const Button = ({ text, theme, onPress, isZero, buttonSize }) => {
  const buttonStyles = [
    styles.button,
    { width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2 }
  ];
  const textStyles = [styles.buttonText];
  //hello

  if (isZero) {
    buttonStyles.push([
      styles.zeroButton,
      { width: buttonSize * 2 + buttonMargin, height: buttonSize, borderRadius: buttonSize / 2 }
    ]);
  }

  if (theme === 'accent') {
    buttonStyles.push(styles.accentButton);
    textStyles.push(styles.accentButtonText);
  } else if (theme === 'secondary') {
    buttonStyles.push(styles.secondaryButton);
    textStyles.push(styles.secondaryButtonText);
  } else {
    buttonStyles.push(styles.defaultButton);
    textStyles.push(styles.defaultButtonText);
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [buttonStyles, pressed && { opacity: 0.7 }]}
    >
      <Text style={textStyles}>{text}</Text>
    </Pressable>
  );
};

export default function App() {
  const { width } = useWindowDimensions();
  const maxWidth = Math.min(width, 400);
  const buttonSize = (maxWidth - buttonMargin * 5) / 4;

  const [currentValue, setCurrentValue] = useState('0');
  const [operator, setOperator] = useState(null);
  const [previousValue, setPreviousValue] = useState(null);

  const handleTap = (type, value) => {
    console.log("Button pressed:", type, value);
    switch (type) {
      case 'number':
        setCurrentValue(currentValue === '0' ? value.toString() : `${currentValue}${value}`);
        break;
      case 'operator':
        if (operator && previousValue) {
          // evaluate previous before setting new
          handleEqual();
        }
        setOperator(value);
        setPreviousValue(currentValue);
        setCurrentValue('0');
        break;
      case 'clear':
        setCurrentValue('0');
        setOperator(null);
        setPreviousValue(null);
        break;
      case 'posneg':
        setCurrentValue((parseFloat(currentValue) * -1).toString());
        break;
      case 'percentage':
        setCurrentValue((parseFloat(currentValue) * 0.01).toString());
        break;
      case 'equal':
        handleEqual();
        break;
      case 'decimal':
        if (!currentValue.includes('.')) {
          setCurrentValue(`${currentValue}.`);
        }
        break;
    }
  };

  const handleEqual = () => {
    if (!operator || !previousValue) return;

    const current = parseFloat(currentValue);
    const previous = parseFloat(previousValue);
    let result = 0;

    switch (operator) {
      case '+': result = previous + current; break;
      case '-': result = previous - current; break;
      case '*': result = previous * current; break;
      case '/':
        if (current === 0) {
          setCurrentValue("Error");
          setOperator(null);
          setPreviousValue(null);
          return;
        }
        result = previous / current;
        break;
    }

    // Limit to prevent overflow text, precision format
    let finalResult = result.toString();
    if (finalResult.length > 10) {
      finalResult = parseFloat(result.toPrecision(9)).toString();
    }

    setCurrentValue(finalResult);
    setOperator(null);
    setPreviousValue(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.calculator}>
        <View style={styles.displayContainer}>
          {previousValue && operator && (
            <Text style={styles.previousValueText}>
              {previousValue} {operator}
            </Text>
          )}
          <Text
            style={styles.displayText}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {currentValue}
          </Text>
        </View>

        <View style={styles.keypadContainer}>
          {/* Row 1 */}
          <View style={styles.row}>
            <Button buttonSize={buttonSize} text="AC" theme="secondary" onPress={() => handleTap('clear')} />
            <Button buttonSize={buttonSize} text="+/-" theme="secondary" onPress={() => handleTap('posneg')} />
            <Button buttonSize={buttonSize} text="%" theme="secondary" onPress={() => handleTap('percentage')} />
            <Button buttonSize={buttonSize} text="÷" theme="accent" onPress={() => handleTap('operator', '/')} />
          </View>

          {/* Row 2 */}
          <View style={styles.row}>
            <Button buttonSize={buttonSize} text="7" onPress={() => handleTap('number', 7)} />
            <Button buttonSize={buttonSize} text="8" onPress={() => handleTap('number', 8)} />
            <Button buttonSize={buttonSize} text="9" onPress={() => handleTap('number', 9)} />
            <Button buttonSize={buttonSize} text="×" theme="accent" onPress={() => handleTap('operator', '*')} />
          </View>

          {/* Row 3 */}
          <View style={styles.row}>
            <Button buttonSize={buttonSize} text="4" onPress={() => handleTap('number', 4)} />
            <Button buttonSize={buttonSize} text="5" onPress={() => handleTap('number', 5)} />
            <Button buttonSize={buttonSize} text="6" onPress={() => handleTap('number', 6)} />
            <Button buttonSize={buttonSize} text="-" theme="accent" onPress={() => handleTap('operator', '-')} />
          </View>

          {/* Row 4 */}
          <View style={styles.row}>
            <Button buttonSize={buttonSize} text="1" onPress={() => handleTap('number', 1)} />
            <Button buttonSize={buttonSize} text="2" onPress={() => handleTap('number', 2)} />
            <Button buttonSize={buttonSize} text="3" onPress={() => handleTap('number', 3)} />
            <Button buttonSize={buttonSize} text="+" theme="accent" onPress={() => handleTap('operator', '+')} />
          </View>

          {/* Row 5 */}
          <View style={styles.row}>
            <Button buttonSize={buttonSize} text="0" isZero onPress={() => handleTap('number', 0)} />
            <Button buttonSize={buttonSize} text="." onPress={() => handleTap('decimal')} />
            <Button buttonSize={buttonSize} text="=" theme="accent" onPress={() => handleTap('equal')} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Slate-900 Dark mode solid background
    justifyContent: 'flex-end',
  },
  calculator: {
    padding: 10,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    flex: 1,
  },
  displayContainer: {
    padding: 20,
    paddingTop: 50,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    flex: 1,
  },
  previousValueText: {
    color: '#94A3B8', // Slate-400
    fontSize: 24,
    marginBottom: 5,
    fontWeight: '300',
  },
  displayText: {
    color: '#F8FAFC', // Slate-50
    fontSize: 80,
    fontWeight: '200',
  },
  keypadContainer: {
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: buttonMargin,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // shadow for android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 32,
    fontWeight: '400',
    userSelect: 'none',
  },
  // Default numbers
  defaultButton: {
    backgroundColor: '#1E293B', // Slate-800
  },
  defaultButtonText: {
    color: '#F8FAFC', // Slate-50
  },
  // AC, +/-, %
  secondaryButton: {
    backgroundColor: '#334155', // Slate-700
  },
  secondaryButtonText: {
    color: '#CBD5E1', // Slate-300
  },
  // Operators
  accentButton: {
    backgroundColor: '#6366F1', // Indigo-500
  },
  accentButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  zeroButton: {
    alignItems: 'flex-start',
    paddingLeft: 30, // visually center the text somewhat
  },
});
