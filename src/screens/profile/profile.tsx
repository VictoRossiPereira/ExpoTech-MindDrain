import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { getIaState, subscribeIaState, fmtTime, IaState } from "@/src/store/ia-store";

const screenWidth = Dimensions.get('window').width;

export const Profile = () => {
    const [iaState, setIaState] = useState<IaState>(getIaState());

    useEffect(() => {
        const unsub = subscribeIaState((s) => setIaState({ ...s }));
        return unsub;
    }, []);

    const { userName, userEmail, dailyLimitMinutes = 120, chartData } = iaState;
    const totalToday = chartData?.totalMinutes || 0;
    const progress = Math.min((totalToday / dailyLimitMinutes) * 100, 100);
    const initials = userName?.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase() || 'MD';

    return (
        <View style={styles.container}>
            <View style={styles.hero}>
                <View style={styles.avatarRing}>
                    <View style={styles.avatarBall}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                    <View style={[styles.avatarProgress, { width: `${progress}%` }]} />
                </View>

                <Text style={styles.profileTitle}>Visão do usuário</Text>
                <Text style={styles.profileSubtitle}>Acompanhe o seu uso e limite diário</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardLabel}>Nome</Text>
                <Text style={styles.cardValue}>{userName || 'Usuário anônimo'}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardLabel}>E-mail</Text>
                <Text style={styles.cardValue}>{userEmail || 'Não disponível'}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardLabel}>Limite diário</Text>
                <Text style={styles.cardValue}>{fmtTime(dailyLimitMinutes)}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardLabel}>Uso hoje</Text>
                <Text style={styles.cardValue}>{fmtTime(totalToday)}</Text>
                <View style={styles.usageBarBackground}>
                    <View style={[styles.usageBarFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.usageMeta}>{Math.round(progress)}% do limite</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 24,
    },
    hero: {
        alignItems: 'center',
        marginBottom: 28,
    },
    avatarRing: {
        width: 170,
        height: 170,
        borderRadius: 85,
        borderWidth: 2,
        borderColor: '#1E7BE0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 18,
        overflow: 'hidden',
        backgroundColor: 'rgba(30,123,224,0.08)',
    },
    avatarBall: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#1A1A2E',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 36,
        fontWeight: '800',
    },
    avatarProgress: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 8,
        backgroundColor: '#34d399',
    },
    profileTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 8,
    },
    profileSubtitle: {
        color: '#9d9bbf',
        fontSize: 14,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#1a1a2e',
        borderRadius: 18,
        padding: 18,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    cardLabel: {
        color: '#9d9bbf',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
    },
    cardValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    usageBarBackground: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 8,
        height: 10,
        marginTop: 12,
        overflow: 'hidden',
    },
    usageBarFill: {
        height: '100%',
        backgroundColor: '#1E7BE0',
    },
    usageMeta: {
        color: '#9d9bbf',
        marginTop: 10,
        fontSize: 12,
    },
});
