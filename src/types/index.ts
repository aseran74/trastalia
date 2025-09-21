// Interfaces para artículos
export interface Article {
  _id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  fotos: string[];
  precio_propuesto_vendedor: number;
  id_vendedor: string;
  estado_articulo: 'DRAFT' | 'EN_VENTA' | 'EN_LOGISTICA' | 'PENDIENTE_APROBACION_ADMIN' | 'OFERTA_COMPRA_ENVIADA' | 'COMPRADO_POR_ADMIN' | 'EN_GALERIA_APTOS' | 'VENDIDO' | 'RECHAZADO';
  modo_venta: 'compra_directa' | 'centro_logistico';
  opciones_logisticas: string[];
  acepta_descuento_admin: boolean;
  fecha_entrada_logistica?: string;
  precio_compra_admin?: number;
  ubicacion: string;
  condicion: string;
  tags: string[];
  views: number;
  nave_logistica?: string;
  ubicacion_nave?: string;
  decision_admin?: AdminDecision;
  respuesta_vendedor?: string;
  comision_venta?: number;
  tarifa_tiempo?: number;
  dias_en_logistica?: number;
  puntos_intercambio?: number;
  puntos_acreditados?: number;
  sellerAccepted?: boolean;
  sellerRejected?: boolean;
  transferido_a_trastalia?: boolean;
  comprador?: string;
  comprador_tipo?: string;
  adminStatus?: string;
  logisticsShip?: boolean;
  logisticsShipLocation?: string;
  seller?: {
    _id: string;
    name: string;
    email: string;
    points: number;
    logisticsLevel: number;
    reputation: number;
  };
}

export interface AdminDecision {
  selectedOption?: 'money' | 'points';
  finalPrice?: number;
  finalPoints?: number;
  reject?: boolean;
  reason?: string;
}

export interface PurchaseRequest {
  _id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  condicion: string;
  precio_propuesto_vendedor: number;
  estado_articulo: string;
  modo_venta: string;
  adminDecision?: AdminDecision;
  sellerAccepted?: boolean;
  sellerRejected?: boolean;
  fotos: string[];
  logisticsShip?: boolean;
  logisticsShipLocation?: string;
  seller?: {
    _id: string;
    name: string;
    email: string;
    points: number;
    logisticsLevel: number;
    reputation: number;
  };
}

// Estados de artículos
export const ESTADO_ARTICULO = {
  DRAFT: 'Borrador',
  EN_VENTA: 'En Venta',
  EN_LOGISTICA: 'En Logística',
  PENDIENTE_APROBACION_ADMIN: 'Pendiente Aprobación',
  OFERTA_COMPRA_ENVIADA: 'Oferta Enviada',
  COMPRADO_POR_ADMIN: 'Comprado por Admin',
  EN_GALERIA_APTOS: 'En Galería',
  VENDIDO: 'Vendido',
  RECHAZADO: 'Rechazado'
} as const;

// Modos de venta
export const MODO_VENTA = {
  directa_casa: 'Venta Directa desde Casa',
  centro_logistico: 'Centro Logístico',
  venta_directa: 'Venta Directa',
  intercambio_puntos: 'Intercambio por Puntos'
} as const;

// Estados de admin
export const ADMIN_STATUS = {
  approved_money: 'Aprobado para Dinero',
  approved_points: 'Aprobado para Puntos',
  approved_both: 'Aprobado para Ambos',
  rejected: 'Rechazado',
  pending: 'Pendiente'
} as const;
