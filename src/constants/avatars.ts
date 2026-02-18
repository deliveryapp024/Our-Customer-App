export interface AvatarOption {
    id: string;
    emoji: string;
    bgColor: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
    { id: 'avatar_01', emoji: '', bgColor: '#00E5FF' },
    { id: 'avatar_02', emoji: '', bgColor: '#FFB300' },
    { id: 'avatar_03', emoji: '', bgColor: '#00C853' },
    { id: 'avatar_04', emoji: '', bgColor: '#FF7043' },
    { id: 'avatar_05', emoji: '', bgColor: '#29B6F6' },
    { id: 'avatar_06', emoji: '', bgColor: '#EC407A' },
    { id: 'avatar_07', emoji: '', bgColor: '#7E57C2' },
    { id: 'avatar_08', emoji: '', bgColor: '#8D6E63' },
    { id: 'avatar_09', emoji: '', bgColor: '#66BB6A' },
    { id: 'avatar_10', emoji: '', bgColor: '#26A69A' },
    { id: 'avatar_11', emoji: '', bgColor: '#FFA726' },
    { id: 'avatar_12', emoji: '', bgColor: '#42A5F5' },
];

export const getAvatarOptionById = (id?: string | null) =>
    AVATAR_OPTIONS.find((option) => option.id === id);

