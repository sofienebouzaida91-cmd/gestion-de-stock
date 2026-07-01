import { useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../../api/client';
import { useInventory } from '../../context/InventoryContext';
import { colors, fonts } from '../../theme';
import { CheckIcon, DialIcon, FlipCameraIcon } from '../../components/Icons';

export default function ScanFlowScreen({ navigation }) {
  const [step, setStep] = useState('camera'); // camera | processing | confirm | done
  const [receipt, setReceipt] = useState(null);
  const [addedCount, setAddedCount] = useState(0);
  const { refresh } = useInventory();

  const runScan = async (photo) => {
    setStep('processing');
    try {
      const data = await api.scanReceipt(photo);
      setReceipt(data);
      setStep('confirm');
    } catch (e) {
      Alert.alert('Lecture impossible', e.message || 'Réessayez.');
      setStep('camera');
    }
  };

  const confirm = async () => {
    const result = await api.confirmReceipt(receipt.id);
    setAddedCount(result.addedCount);
    setStep('done');
    refresh();
  };

  const goToStock = () => {
    navigation.navigate('Main', { screen: 'Stock' });
  };

  if (step === 'camera') {
    return <CameraStep onClose={() => navigation.goBack()} onCaptured={runScan} />;
  }
  if (step === 'processing') {
    return <ProcessingStep />;
  }
  if (step === 'confirm') {
    return (
      <ConfirmStep
        receipt={receipt}
        setReceipt={setReceipt}
        onClose={() => navigation.goBack()}
        onConfirm={confirm}
      />
    );
  }
  return <DoneStep addedCount={addedCount} onGoToStock={goToStock} />;
}

// ---------------------------------------------------------------- camera --

function CameraStep({ onClose, onCaptured }) {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [torch, setTorch] = useState(false);
  const cameraRef = useRef(null);

  const shoot = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.6 });
    onCaptured(photo);
  };

  const pickFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.6 });
    if (!result.canceled && result.assets?.[0]) {
      onCaptured(result.assets[0]);
    }
  };

  if (!permission) {
    return <View style={[styles.camContainer, { paddingTop: insets.top }]} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.camContainer, styles.permissionContainer, { paddingTop: insets.top }]}>
        <Text style={styles.permissionText}>Cagette a besoin d’accéder à la caméra pour scanner vos tickets.</Text>
        <Pressable style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Autoriser l’accès à la caméra</Text>
        </Pressable>
        <Pressable onPress={onClose}>
          <Text style={styles.permissionCancel}>Annuler</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.camContainer}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} enableTorch={torch} />

      <View style={[styles.camHeader, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.roundGhostButton} onPress={onClose}>
          <Text style={styles.roundGhostButtonText}>✕</Text>
        </Pressable>
        <Text style={styles.camTitle}>Scanner un ticket</Text>
        <Pressable style={styles.roundGhostButton} onPress={() => setTorch((t) => !t)}>
          <DialIcon color={torch ? colors.greenLight : '#fff'} />
        </Pressable>
      </View>

      <View style={styles.frameOverlay} pointerEvents="none">
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />
      </View>

      <Text style={styles.camHint}>Placez le ticket dans le cadre</Text>

      <View style={[styles.camControls, { paddingBottom: Math.max(insets.bottom, 20) + 24 }]}>
        <Pressable style={styles.galleryButton} onPress={pickFromLibrary} />
        <Pressable style={styles.shutterButton} onPress={shoot}>
          <View style={styles.shutterInner} />
        </Pressable>
        <Pressable style={styles.flipButton} onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}>
          <FlipCameraIcon />
        </Pressable>
      </View>
    </View>
  );
}

// ------------------------------------------------------------ processing --

function ProcessingStep() {
  return (
    <View style={[styles.camContainer, styles.processingContainer]}>
      <ActivityIndicator size="large" color={colors.greenLight} />
      <Text style={styles.processingTitle}>Lecture du ticket…</Text>
      <Text style={styles.processingSub}>Reconnaissance des articles en cours</Text>
    </View>
  );
}

// ---------------------------------------------------------------- confirm --

function ConfirmStep({ receipt, setReceipt, onClose, onConfirm }) {
  const insets = useSafeAreaInsets();
  const [addingItem, setAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');

  const includeCount = receipt.items.filter((it) => it.included).length;
  const purchasedDate = new Date(receipt.purchasedAt);
  const dateLabel = `${String(purchasedDate.getDate()).padStart(2, '0')}/${String(purchasedDate.getMonth() + 1).padStart(2, '0')}`;

  const patchItem = async (itemId, patch) => {
    setReceipt((r) => ({ ...r, items: r.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it)) }));
    await api.updateReceiptItem(receipt.id, itemId, patch);
  };

  const addMissingItem = async () => {
    const name = newItemName.trim();
    if (!name) return;
    const created = await api.addReceiptItem(receipt.id, { name, category: 'Épicerie' });
    setReceipt((r) => ({ ...r, items: [...r.items, { ...created, sub: created.category }] }));
    setNewItemName('');
    setAddingItem(false);
  };

  return (
    <View style={styles.confirmContainer}>
      <View style={[styles.confirmHeader, { paddingTop: insets.top + 14 }]}>
        <View style={styles.confirmHeaderRow}>
          <View style={styles.confirmHeaderLeft}>
            <View style={styles.confirmCheckCircle}>
              <CheckIcon size={17} strokeWidth={3} />
            </View>
            <View>
              <Text style={styles.confirmTitle}>Ticket lu</Text>
              <Text style={styles.confirmMeta}>{receipt.store} · {dateLabel} · {receipt.total.toFixed(2).replace('.', ',')} €</Text>
            </View>
          </View>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>
        <Text style={styles.confirmHint}>Vérifiez les articles, ajustez les quantités puis validez.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.confirmList}>
        {receipt.items.map((item) => (
          <View key={item.id} style={styles.confirmRow}>
            <View style={styles.rowEmojiBox}>
              <Text style={styles.rowEmoji}>{item.emoji}</Text>
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.rowMeta}>{item.sub}</Text>
            </View>
            <View style={styles.stepper}>
              <Pressable style={styles.stepperButton} onPress={() => patchItem(item.id, { qty: Math.max(1, item.qty - 1) })}>
                <Text style={styles.stepperButtonText}>−</Text>
              </Pressable>
              <Text style={styles.stepperQty}>{item.qty}</Text>
              <Pressable style={styles.stepperButton} onPress={() => patchItem(item.id, { qty: item.qty + 1 })}>
                <Text style={styles.stepperButtonText}>+</Text>
              </Pressable>
            </View>
            <Pressable
              style={[styles.checkbox, { borderColor: item.included ? colors.green : colors.borderDashed, backgroundColor: item.included ? colors.green : '#fff' }]}
              onPress={() => patchItem(item.id, { included: !item.included })}
            >
              {item.included && <CheckIcon size={15} strokeWidth={3.4} />}
            </Pressable>
          </View>
        ))}

        {addingItem ? (
          <View style={styles.addItemRow}>
            <TextInput
              autoFocus
              style={styles.addItemInput}
              placeholder="Nom de l’article"
              placeholderTextColor={colors.textFainter}
              value={newItemName}
              onChangeText={setNewItemName}
              onSubmitEditing={addMissingItem}
              returnKeyType="done"
            />
            <View style={styles.addItemActions}>
              <Pressable style={styles.addItemCancel} onPress={() => { setAddingItem(false); setNewItemName(''); }}>
                <Text style={styles.addItemCancelText}>Annuler</Text>
              </Pressable>
              <Pressable style={styles.addItemConfirm} onPress={addMissingItem}>
                <Text style={styles.addItemConfirmText}>Ajouter</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable style={styles.addMissingButton} onPress={() => setAddingItem(true)}>
            <Text style={styles.addMissingButtonText}>+ Ajouter un article manquant</Text>
          </Pressable>
        )}
      </ScrollView>

      <View style={[styles.confirmFooter, { paddingBottom: Math.max(insets.bottom, 20) + 14 }]}>
        <Pressable style={styles.confirmButton} onPress={onConfirm}>
          <Text style={styles.confirmButtonText}>
            Ajouter {includeCount} produit{includeCount > 1 ? 's' : ''}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// ------------------------------------------------------------------ done --

function DoneStep({ addedCount, onGoToStock }) {
  const insets = useSafeAreaInsets();
  const title = `${addedCount} produit${addedCount > 1 ? 's ajoutés' : ' ajouté'}`;
  return (
    <View style={[styles.doneContainer, { paddingTop: insets.top }]}>
      <View style={styles.doneCircleOuter}>
        <View style={styles.doneCircleInner}>
          <CheckIcon size={34} strokeWidth={3} />
        </View>
      </View>
      <Text style={styles.doneTitle}>{title}</Text>
      <Text style={styles.doneSub}>Votre stock est à jour. Nous surveillons les dates de péremption pour vous.</Text>
      <Pressable style={styles.doneButton} onPress={onGoToStock}>
        <Text style={styles.doneButtonText}>Voir mon stock</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  camContainer: { flex: 1, backgroundColor: colors.camBg },
  camHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 8,
  },
  roundGhostButton: {
    width: 40, height: 40, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center', justifyContent: 'center',
  },
  roundGhostButtonText: { color: '#fff', fontSize: 18 },
  camTitle: { fontFamily: fonts.displayBold, fontSize: 16, color: '#fff' },

  frameOverlay: { position: 'absolute', top: '18%', left: 34, right: 34, bottom: '22%' },
  corner: { position: 'absolute', width: 34, height: 34, borderColor: colors.greenLight },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 6 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 6 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 6 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 6 },

  camHint: { textAlign: 'center', color: 'rgba(255,255,255,0.85)', fontSize: 13, fontFamily: fonts.bodyBold, paddingBottom: 14 },
  camControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 40 },
  galleryButton: { width: 44, height: 44, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.14)' },
  shutterButton: {
    width: 74, height: 74, borderRadius: 999, borderWidth: 4, borderColor: '#fff',
    padding: 4, alignItems: 'center', justifyContent: 'center',
  },
  shutterInner: { flex: 1, alignSelf: 'stretch', borderRadius: 999, backgroundColor: colors.greenLight },
  flipButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },

  permissionContainer: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 34, gap: 16 },
  permissionText: { color: '#fff', textAlign: 'center', fontFamily: fonts.body, fontSize: 14 },
  permissionButton: { backgroundColor: colors.green, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 24 },
  permissionButtonText: { color: '#fff', fontFamily: fonts.bodyBold, fontSize: 14 },
  permissionCancel: { color: 'rgba(255,255,255,0.6)', fontFamily: fonts.bodyBold, fontSize: 13 },

  processingContainer: { alignItems: 'center', justifyContent: 'center', gap: 18 },
  processingTitle: { color: '#fff', fontFamily: fonts.bodyBold, fontSize: 15 },
  processingSub: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: -10 },

  confirmContainer: { flex: 1, backgroundColor: colors.bg },
  confirmHeader: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.hairline, paddingHorizontal: 20, paddingBottom: 14 },
  confirmHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  confirmHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  confirmCheckCircle: { width: 30, height: 30, borderRadius: 999, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  confirmTitle: { fontFamily: fonts.display, fontSize: 18, color: colors.text },
  confirmMeta: { fontSize: 11, color: colors.textFaint, marginTop: 3 },
  closeButton: { width: 36, height: 36, borderRadius: 999, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' },
  closeButtonText: { color: colors.textMuted, fontSize: 17 },
  confirmHint: { marginTop: 12, fontSize: 12.5, color: colors.textMuted },

  confirmList: { padding: 16, paddingBottom: 120 },
  confirmRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff',
    borderRadius: 16, padding: 10, paddingHorizontal: 12, marginBottom: 10,
  },
  rowEmojiBox: { width: 40, height: 40, borderRadius: 11, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' },
  rowEmoji: { fontSize: 21 },
  rowBody: { flex: 1, minWidth: 0 },
  rowName: { fontFamily: fonts.bodyBold, fontSize: 14.5, color: colors.text },
  rowMeta: { fontSize: 11, color: colors.textFainter },

  stepper: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.chip, borderRadius: 999, padding: 3 },
  stepperButton: { width: 28, height: 28, borderRadius: 999, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  stepperButtonText: { fontSize: 17, fontFamily: fonts.bodyBold, color: colors.text },
  stepperQty: { minWidth: 16, textAlign: 'center', fontFamily: fonts.bodyExtraBold, fontSize: 14, color: colors.text },

  checkbox: { width: 28, height: 28, borderRadius: 9, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },

  addItemRow: { marginBottom: 10, gap: 8 },
  addItemInput: {
    backgroundColor: '#fff', borderRadius: 14, borderWidth: 1.5, borderColor: colors.borderDashed,
    paddingVertical: 12, paddingHorizontal: 14, fontFamily: fonts.body, fontSize: 14, color: colors.text,
  },
  addItemActions: { flexDirection: 'row', gap: 8 },
  addItemCancel: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: colors.chip },
  addItemCancelText: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.textMuted },
  addItemConfirm: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: colors.green },
  addItemConfirmText: { fontFamily: fonts.bodyBold, fontSize: 13, color: '#fff' },
  addMissingButton: {
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.borderDashed, borderRadius: 14,
    paddingVertical: 13, alignItems: 'center',
  },
  addMissingButtonText: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.textFaint },

  confirmFooter: {
    position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 16, paddingTop: 14,
    backgroundColor: colors.bg,
  },
  confirmButton: {
    backgroundColor: colors.green, borderRadius: 16, paddingVertical: 16, alignItems: 'center',
    shadowColor: colors.green, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.32, shadowRadius: 20, elevation: 6,
  },
  confirmButtonText: { color: '#fff', fontFamily: fonts.displayBold, fontSize: 16 },

  doneContainer: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 34 },
  doneCircleOuter: { width: 96, height: 96, borderRadius: 999, backgroundColor: colors.greenBg, alignItems: 'center', justifyContent: 'center' },
  doneCircleInner: { width: 64, height: 64, borderRadius: 999, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  doneTitle: { fontFamily: fonts.display, fontSize: 24, color: colors.text, marginTop: 24, textAlign: 'center' },
  doneSub: { fontSize: 14, color: colors.textMuted, marginTop: 8, textAlign: 'center', lineHeight: 21 },
  doneButton: { marginTop: 30, backgroundColor: colors.text, borderRadius: 14, paddingVertical: 15, paddingHorizontal: 40 },
  doneButtonText: { color: '#fff', fontFamily: fonts.displayBold, fontSize: 15 },
});
