import { useCallback, useMemo } from 'react'
import { FlatList, StyleSheet, Text } from 'react-native'
import { router } from 'expo-router'
import Screen from '@/components/Screen/Screen'
import ScreenTitle from '@/components/ScreenTitle/ScreenTitle'
import TurnoCard from '@/components/TurnoCard/TurnoCard'
import BottomBar from '@/components/BottomBar/BottomBar'
import Button from '@/components/Button/Button'
import { MOCK_APPOINTMENTS } from '@/mocks/appointments'
import { formatLongDate } from '@/utils/dates'
import { doctorFullName, getDisplayStatus, isUpcoming, sortAppointments } from '@/utils/appointments'
import ListEntryItem from '@/components/ListEntryItem/ListEntryItem'
import useListEntrance from '@/hooks/useListEntrance'
import { colors, fonts } from '@/theme'

const keyExtractor = a => String(a.id)
const openTurno = id => router.push({ pathname: '/turnos/detalle', params: { modo: 'ver', id } })

// Etapa 1: datos de relleno. Después se reemplaza por patientPortalService.getMyAppointments().
export default function TurnosScreen() {
  const appointments = useMemo(() => sortAppointments(MOCK_APPOINTMENTS), [])
  const upcomingCount = appointments.filter(a => isUpcoming(a)).length
  const subtitle = upcomingCount === 1 ? '1 turno próximo' : `${upcomingCount} turnos próximos`
  const entrance = useListEntrance()

  const renderItem = useCallback(
    ({ item, index }) => (
      <ListEntryItem index={index} progress={entrance}>
        <TurnoCard
          id={item.id}
          date={formatLongDate(item.date)}
          time={`${item.startTime} hs`}
          doctorName={doctorFullName(item)}
          status={getDisplayStatus(item)}
          muted={!isUpcoming(item)}
          onPress={openTurno}
        />
      </ListEntryItem>
    ),
    [entrance],
  )

  return (
    <Screen>
      <FlatList
        data={appointments}
        keyExtractor={keyExtractor}
        // Pocas tarjetas en el primer render: menos trabajo de JS al montar la pantalla
        initialNumToRender={6}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<ScreenTitle title="Mis turnos" subtitle={subtitle} />}
        ListEmptyComponent={<Text style={styles.empty}>Todavía no tenés turnos.</Text>}
        renderItem={renderItem}
      />

      <BottomBar>
        <Button label="Reservar Turno" onPress={() => router.push({ pathname: '/turnos/detalle', params: { modo: 'crear' } })} />
      </BottomBar>
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
