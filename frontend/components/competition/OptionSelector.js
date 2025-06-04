import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Platform, StyleSheet } from 'react-native'; // Dodaj StyleSheet
import { AntDesign } from '@expo/vector-icons';
import { styles } from '../../styles/CompetitionStyles/OptionSelector.styles'; // Importuj nowe style
import { colors } from '../../theme/theme'; // Importuj theme dla kolorów itp.

// Usunięto 'placeholder' z propsów
const OptionSelector = ({ label, options, selectedValue, onSelect, loading = false, disabled = false }) => {
    const [hoveredOption, setHoveredOption] = useState(null);

    return (
        <View style={styles.selectorContainer}>
            <Text style={styles.selectorLabel}>{label}:</Text>
            {loading ? (
                <ActivityIndicator size="small" color={colors.primary} style={styles.selectorLoading} />
            // Zmieniono warunek: jeśli nie ma opcji
            ) : options.length === 0 ? (
                <Text style={styles.selectorEmpty}>Brak opcji</Text>
            ) : (
                <View style={styles.optionsWrapper}>
                    {/* Usunięto blok kodu renderujący placeholder */}
                    {options.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.selectorOption,
                                selectedValue === option.value && styles.selectorOptionActive,
                                option.isCompleted && !(selectedValue === option.value) && styles.selectorOptionCompleted,
                                Platform.OS === 'web' && hoveredOption === option.value && styles.selectorOptionHover,
                                // Dodatkowe style dla hover na ukończonym elemencie
                                Platform.OS === 'web' && hoveredOption === option.value && option.isCompleted && ! (selectedValue === option.value) && styles.selectorOptionHover,
                                disabled && { opacity: 0.5 }
                            ]}
                            onPress={() => !disabled && onSelect(option.value)}
                            disabled={loading || disabled}
                            {...(Platform.OS === 'web' && {
                                onMouseEnter: () => !disabled && setHoveredOption(option.value),
                                onMouseLeave: () => !disabled && setHoveredOption(null),
                            })}
                        >
                            <Text style={[
                                styles.selectorOptionText,
                                (selectedValue === option.value || (Platform.OS === 'web' && hoveredOption === option.value)) && styles.selectorOptionTextActive,
                                option.isCompleted && !(selectedValue === option.value || (Platform.OS === 'web' && hoveredOption === option.value)) && styles.selectorOptionTextCompleted
                            ]}>
                                {option.label}
                            </Text>
                            {option.isCompleted && !(Platform.OS === 'web' && hoveredOption === option.value) && (
                                 <AntDesign name="checkcircle" size={14} color={(selectedValue === option.value) ? colors.textLight : colors.success} style={styles.selectorCompletedIcon} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

export default OptionSelector;