
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'inter': ['Inter', 'sans-serif'],
				'mulish': ['Mulish', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// HAP MEDBUDDY - Bảng màu thuần xanh dương
				'senior-navy': '#1E3A5F',      // Xanh navy đậm - tiêu đề chính
				'senior-blue': '#2E5A8A',      // Xanh dương chính - buttons
				'senior-teal': '#3B82A6',      // Xanh teal - accent
				'senior-sky': '#5BA3D4',       // Xanh sky - secondary
				'senior-light': '#E8F4FD',     // Xanh rất nhạt - background
				'senior-pale': '#F0F8FF',      // Xanh cực nhạt - background chính
				'senior-card': '#FFFFFF',      // Trắng tinh - card background
				'senior-mint': '#7BC8E8',      // Xanh mint - success/positive
				'senior-steel': '#4A6B8A',     // Xanh thép - text secondary
				'senior-accent': '#4A90C2',    // Xanh accent - highlights
				'senior-deep': '#16365C',      // Xanh đậm - text chính
				'senior-soft': '#B8D4EA',      // Xanh mềm - borders
				'senior-gray': '#4A6B8A',      // Xanh thép cho text secondary
				'senior-success': '#7BC8E8',   // Xanh mint cho success
				'senior-warning': '#5BA3D4',   // Xanh sky cho warning
				'senior-purple': '#3B82A6',    // Xanh teal thay cho purple
				
				// Giữ lại các màu mapping cũ cho tương thích
				'mint-pastel': '#4A90C2',      // Mapping to senior-accent
				'pink-pastel': '#5BA3D4',      // Mapping to senior-sky  
				'green-pastel': '#7BC8E8',     // Mapping to senior-mint
				'cream': '#F0F8FF',            // Mapping to senior-pale
				
				// Update existing color names to pure blue variants
				'blue-primary': '#2E5A8A',     // senior-blue
				'blue-secondary': '#4A90C2',   // senior-accent
				'blue-light': '#E8F4FD',       // senior-light
				'blue-cream': '#F0F8FF',       // senior-pale
				'blue-card': '#FFFFFF',        // senior-card
				'blue-success': '#7BC8E8',     // senior-mint
				'blue-warning': '#5BA3D4',     // senior-sky
				'blue-accent': '#4A90C2',      // senior-accent
				'blue-mint': '#7BC8E8',        // senior-mint
				'blue-navy': '#1E3A5F',        // senior-navy
				'blue-sky': '#5BA3D4',         // senior-sky
				'blue-slate': '#4A6B8A',       // senior-steel
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'heartbeat': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' }
				},
				'gentle-bounce': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-3px)' }
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'heartbeat': 'heartbeat 2s ease-in-out infinite',
				'gentle-bounce': 'gentle-bounce 3s ease-in-out infinite',
				'fade-in-up': 'fade-in-up 0.6s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
