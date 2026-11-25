import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { NextConsultHero as RealNextConsultHero } from '~/components/home/NextConsultHero';
import { AutoMarquee } from '~/components/ui/AutoMarquee';
import { PressScale } from '~/components/ui/PressScale';
import { Text } from '~/components/ui/Text';
import { useSpecialties } from '~/hooks/search/useSpecialties';
import type { ConsultationWithDoctorResponse } from '~/lib/api';
import { featuredSpecialties } from '~/lib/home/featured-specialties';
import { BRAND, withOpacity } from '~/theme/colors';
import { SURFACE } from '~/theme/surface';

// The app shows one hero at a time; the video state stacks the next-consult hero and the specialty marquee.
export function NextConsultHero({ consultation }: { consultation: ConsultationWithDoctorResponse }) {
  const { data: specialties = [] } = useSpecialties();
  const featured = useMemo(() => featuredSpecialties(specialties, 8), [specialties]);

  return (
    <View style={styles.wrap}>
      <RealNextConsultHero consultation={consultation} />
      {featured.length > 0 ? (
        <AutoMarquee inset={SURFACE.gutter}>
          {featured.map((specialty) => (
            <PressScale key={specialty.name} onPress={() => {}} accessibilityLabel={`Buscar ${specialty.name}`} style={styles.chip}>
              <View style={styles.chipIcon}>
                <Image source={specialty.image} style={styles.chipImage} contentFit="contain" />
              </View>
              <Text className="font-text-medium text-[14px]" style={styles.chipLabel}>
                {specialty.name}
              </Text>
            </PressScale>
          ))}
        </AutoMarquee>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 20 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
    paddingLeft: 6,
    paddingRight: 14,
    borderRadius: 999,
    backgroundColor: withOpacity(BRAND.white, 0.16),
  },
  chipIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: BRAND.white },
  chipImage: { width: 20, height: 20 },
  chipLabel: { color: BRAND.white },
});
