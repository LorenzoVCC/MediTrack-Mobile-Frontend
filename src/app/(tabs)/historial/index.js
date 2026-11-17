import { useCallback } from 'react'
import { FlatList, StyleSheet, Text } from 'react-native'
import { router } from 'expo-router'
import Screen from '@/components/Screen/Screen'
import ScreenTitle from '@/components/ScreenTitle/ScreenTitle'
import ConsultaCard from '@/components/ConsultaCard/ConsultaCard'
import { MOCK_CONSULTATIONS } from '@/mocks/consultations'
import { formatLongDate } from '@/utils/dates'
import { doctorFullName } from '@/utils/appointments'
import ListEntryItem from '@/components/ListEntryItem/ListEntryItem'
import useListEntrance from '@/hooks/useListEntrance'
import { colors, fonts } from '@/theme'

// Etapa 1: datos de relleno. Después se reemplaza por patientPortalService.getMyConsultations().
const consultations = MOCK_CONSULTATIONS

const keyExtractor = c => String(c.id)
const openConsulta = id => router.push(`/historial/${id}`)

export default function HistorialScreen() {
  const count = consultations.length === 1 ? '1 consulta' : `${consultations.length} consultas`
  const entrance = useListEntrance()

  const renderItem = useCallback(
    ({ item, index }) => (
      <ListEntryItem index={index} progress={entrance}>
        <ConsultaCard
          id={item.id}
          date={formatLongDate(item.date)}
          reason={item.reason}
          doctorName={doctorFullName(item)}
          onPress={openConsulta}
        />
      </ListEntryItem>
    ),
    [entrance],
  )

  return (
    <Screen>
      <FlatList
        data={consultations}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<ScreenTitle title="Historial de consultas" subtitle={consultations.length ? count : null} />}
        ListEmptyComponent={<Text style={styles.empty}>Todavía no hay consultas registradas.</Text>}
        renderItem={renderItem}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    gap: 12,
  },
  empty: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textSecondary,
  },
})
