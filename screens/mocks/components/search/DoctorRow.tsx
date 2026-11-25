import { Star } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar } from '~/components/ui/Avatar';
import { Button } from '~/components/ui/Button';
import { Text } from '~/components/ui/Text';
import { Well } from '~/components/ui/surface/Well';
import { formatRating } from '~/lib/format/number';
import type { SearchDoctor } from '~/lib/search/partner-card';
import { BRAND, THEMES } from '~/theme/colors';
import { SURFACE } from '~/theme/surface';

import CalendarIcon from '@hugeicons/core-free-icons/Calendar03Icon';

import { fixture } from '@screens/fixture';

interface DoctorRowProps {
  doctor: SearchDoctor;
  priceLabel: string;
  specialtyName: string | null;
  covered: boolean;
  slotLabel: string | null;
  onPress: (doctor: SearchDoctor) => void;
  onPressSlot: (doctor: SearchDoctor) => void;
}

function buildAccessibilityLabel({
  doctor,
  priceLabel,
  specialtyName,
  slotLabel,
}: Pick<DoctorRowProps, 'doctor' | 'priceLabel' | 'specialtyName' | 'slotLabel'>) {
  const parts = [doctor.name];
  if (specialtyName) parts.push(specialtyName);
  if (doctor.rating_count > 0) {
    parts.push(
      `avaliação ${formatRating(doctor.average_rating)} de ${doctor.rating_count} pacientes`,
    );
  }
  parts.push(priceLabel);
  if (slotLabel) parts.push(`próximo horário ${slotLabel}`);
  return parts.join(', ');
}

export const DoctorRow = memo(function DoctorRow({
  doctor,
  priceLabel,
  specialtyName,
  covered,
  slotLabel,
  onPress,
  onPressSlot,
}: DoctorRowProps) {
  const rated = doctor.rating_count > 0;

  return (
    <View style={styles.panel}>
      <Pressable
        onPress={() => onPress(doctor)}
        accessibilityRole="button"
        accessibilityLabel={buildAccessibilityLabel({
          doctor,
          priceLabel,
          specialtyName,
          slotLabel,
        })}
        className="active:opacity-90"
      >
        <Well style={styles.well}>
          <Avatar
            name={doctor.name}
            imageUrl={doctor.avatar_url}
            size={52}
            corners="tile"
            tone="monogram"
          />
          <View style={styles.body}>
            <Text className="font-text-bold text-[16px]" style={styles.name} numberOfLines={1}>
              {doctor.name}
            </Text>
            {specialtyName ? (
              <Text className="mt-0.5 font-text text-[13px]" style={styles.muted} numberOfLines={1}>
                {specialtyName}
              </Text>
            ) : null}
            {rated ? (
              <View style={styles.rating}>
                <Star size={12} color={BRAND.ink[900]} fill={BRAND.ink[900]} />
                <Text className="font-text-medium text-[13px]" style={styles.ratingText}>
                  {formatRating(doctor.average_rating)}
                </Text>
                <Text className="font-text text-[13px]" style={styles.muted}>
                  {`(${doctor.rating_count})`}
                </Text>
              </View>
            ) : null}
          </View>
          {covered ? (
            <Text className="font-text-medium text-[13px]" style={styles.muted}>
              {priceLabel}
            </Text>
          ) : (
            <View style={styles.price}>
              {fixture().strikePrice ? (
                <Text className="font-text text-[12px]" style={[styles.muted, { textDecorationLine: 'line-through' }]}>
                  {String(fixture().strikePrice)}
                </Text>
              ) : null}
              <Text className="font-text-bold text-[16px]" style={styles.name}>
                {priceLabel}
              </Text>
              <Text className="mt-0.5 font-text text-[12px]" style={styles.muted}>
                por consulta
              </Text>
            </View>
          )}
        </Well>
      </Pressable>
      {slotLabel ? (
        <View style={styles.footer}>
          <View style={styles.fill} />
          <Button
            pill
            size="compact"
            variant="outline"
            icon={CalendarIcon}
            label={slotLabel}
            accessibilityLabel={`Agendar ${slotLabel}`}
            onPress={() => onPressSlot(doctor)}
          />
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  panel: {
    marginHorizontal: SURFACE.gutter,
    marginBottom: SURFACE.gap,
    padding: SURFACE.inset,
    borderRadius: SURFACE.panelRadius,
    borderCurve: 'continuous',
    backgroundColor: SURFACE.panel,
  },
  well: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  body: { flex: 1, minWidth: 0 },
  name: { color: THEMES.light.foreground },
  muted: { color: THEMES.light.mutedForeground },
  rating: { marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { color: THEMES.light.foregroundBody },
  price: { alignItems: 'flex-end' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 2,
  },
  fill: { flex: 1 },
});
