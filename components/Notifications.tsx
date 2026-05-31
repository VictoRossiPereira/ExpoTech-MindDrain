import React, { createContext, useContext, useRef, useState } from 'react';
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ToastType = 'success' | 'error' | 'info';

const NotificationsContext = createContext({
    showToast: (message: string, type?: ToastType) => { },
    showConfirm: (opts: { title?: string; message: string; onConfirm?: () => void; onCancel?: () => void }) => { },
});

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as ToastType });
    const [confirm, setConfirm] = useState({ visible: false, title: '', message: '', onConfirm: undefined as (() => void) | undefined, onCancel: undefined as (() => void) | undefined });
    const opacity = useRef(new Animated.Value(0)).current;

    const showToast = (message: string, type: ToastType = 'info') => {
        setToast({ visible: true, message, type });
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start(() => {
            setTimeout(() => {
                Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setToast((t) => ({ ...t, visible: false })));
            }, 3000);
        });
    };

    const showConfirm = ({ title, message, onConfirm, onCancel }: { title?: string; message: string; onConfirm?: () => void; onCancel?: () => void }) => {
        setConfirm({ visible: true, title: title || '', message, onConfirm, onCancel });
    };

    const handleConfirm = () => {
        if (confirm.onConfirm) confirm.onConfirm();
        setConfirm((c) => ({ ...c, visible: false }));
    };

    const handleCancel = () => {
        if (confirm.onCancel) confirm.onCancel();
        setConfirm((c) => ({ ...c, visible: false }));
    };

    return (
        <NotificationsContext.Provider value={{ showToast, showConfirm }}>
            {children}

            {toast.visible && (
                <Animated.View pointerEvents="none" style={[styles.toast, toast.type === 'error' ? styles.error : toast.type === 'success' ? styles.success : styles.info, { opacity }]}>
                    <Text style={styles.toastText}>{toast.message}</Text>
                </Animated.View>
            )}

            <Modal visible={confirm.visible} transparent animationType="fade">
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalBox}>
                        {confirm.title ? <Text style={styles.modalTitle}>{confirm.title}</Text> : null}
                        <Text style={styles.modalMsg}>{confirm.message}</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={handleCancel} style={styles.modalBtn}>
                                <Text style={styles.modalBtnText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleConfirm} style={[styles.modalBtn, styles.destructive]}>
                                <Text style={[styles.modalBtnText, styles.destructiveText]}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </NotificationsContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationsContext);

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        top: 48,
        left: 16,
        right: 16,
        padding: 12,
        borderRadius: 10,
        zIndex: 9999,
        elevation: 9999,
    },
    toastText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
    success: { backgroundColor: '#34d399' },
    error: { backgroundColor: '#ff3b30' },
    info: { backgroundColor: '#3b82f6' },
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalBox: { backgroundColor: '#111', padding: 18, borderRadius: 12, width: '86%', maxWidth: 400 },
    modalTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 8 },
    modalMsg: { color: '#ddd', fontSize: 14, marginBottom: 14 },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
    modalBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
    modalBtnText: { color: '#9aa0c3', fontWeight: '700' },
    destructive: { backgroundColor: 'transparent' },
    destructiveText: { color: '#ff453a' },
});
