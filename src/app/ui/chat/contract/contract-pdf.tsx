'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Contract } from '@/src/app/lib/definitions';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
});

export default function ContractPdf({ contract }: { contract: Contract }) {
  const { carrier, principal, good, road } = contract;

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Umowa przewozu</Text>
          <Text style={styles.text}>
            Data wyjazdu: {new Date(road.departureDate).toLocaleDateString()}
          </Text>
          <Text style={styles.text}>
            Data przyjazdu: {new Date(road.arrivalDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Przewoźnik</Text>
          <Text style={styles.text}>Firma: {carrier.companyDetails!.companyName}</Text>
          <Text style={styles.text}>NIP: {carrier.companyDetails!.taxId}</Text>
          <Text style={styles.text}>
            Adres: {carrier.companyDetails!.address.street},{' '}
            {carrier.companyDetails!.address.cityId}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Zleceniodawca</Text>
          <Text style={styles.text}>Firma: {principal.companyDetails!.companyName}</Text>
          <Text style={styles.text}>NIP: {principal.companyDetails!.taxId}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Towar</Text>
          <Text style={styles.text}>Kategoria: {good.category}</Text>
          <Text style={styles.text}>Nazwa: {good.name}</Text>
        </View>
      </Page>
    </Document>
  );
}
