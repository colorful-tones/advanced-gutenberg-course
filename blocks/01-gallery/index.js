/**
 * Block dependencies
 */

import icon from "./icon";
import style from "./style.scss";
import Gallery from "react-photo-gallery";

/**
 * Block libraries
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { registerBlockType } = wp.blocks;
const { BlockControls, InspectorControls, MediaPlaceholder, MediaUpload } = wp.editor;
const { IconButton, PanelBody, PanelRow, RadioControl, ToggleControl, Toolbar } = wp.components;

/**
 * Register block
 */
export default registerBlockType( "jsforwpadvgblocks/gallery", {
	title: __( "Gallery", "jsforwpadvgblocks" ),
	description: __( "A demo custom gallery block", "jsforwpadvgblocks" ),
	category: "jsforwpadvblocks",
	icon,
	keywords: [
		__("Masonry", "jsforwpadvgblocks"),
		__("Images Media", "jsforwpadvgblocks"),
		__("Lightbox", "jsforwpadvgblocks"),
	],
	supports: ["full", "wide"],
	attributes: {
		images: {
			type: "array",
			default: []
		},
		direction: {
			type: "string",
			default: "row"
		},
		isLightboxEnabled: {
			type: "boolean",
			default: true
		}
	},
	edit: props => {
		const {
			attributes: {images, direction, isLightboxEnabled},
			className,
			setAttributes
		} = props;
		const onSelectImages = newImages => {
			const images = newImages.map( img => {
				return {
					src: img.sizes.large.url,
					width: img.sizes.large.width,
					height: img.sizes.large.height,
					id: img.id,
					alt: img.alt,
					caption: img.caption,
				};
			});
			setAttributes({ images });
		};
		
		return (
			<Fragment>
				<InspectorControls>
					<PanelBody 
						title={__("Gallery Settings", "jsforwpadvgblocks")} 
						initialOpen={true}
					>
					<PanelRow>
						<RadioControl
							label={__("Grid Style", "jsforwpadvgblocks")}
							selected={direction}
							options={[
								{ label: __("Rows", "jsforwpadvgblocks"), value: "row"},
								{ label: __("Columns", "jsforwpadvgblocks"), value: "column"},
							]} 
							onChange={direction => setAttributes({ direction })}
						>
						</RadioControl>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__("Enable / disable lightbox", "jsforwpadvgblocks")}
							checked={isLightboxEnabled}
							onChange={isLightboxEnabled => setAttributes({ isLightboxEnabled })}
						>
						</ToggleControl>
					</PanelRow>
					</PanelBody>
				</InspectorControls>

				{!!images.length && (
					<BlockControls>
						<Toolbar>
							<MediaUpload 
								allowedTypes={["images"]} 
								multiple 
								gallery
								value={images.map(img => img.id)}
								onSelect={onSelectImages}
								render={({open}) => (
									<IconButton
										className="components-toolbar__control"	
										label={ __("Edit Gallery", "jsforwpadvgblocks")}
										icon="edit"
										onClick={open}
									/>
								)}
							/>
						</Toolbar>
					</BlockControls>
				)}
				<div className={`${className} ${direction}`}>
					{!!!images.length ? (
						<MediaPlaceholder
							labels={{
								title: __("Gallery", "jsforwpadvgblocks"),
								instructions: __("Drag images, upload new ones or select files from your library.", "jsforwpadvgblocks"),
							}}
							icon={icon}
							accept="images/*"
							multiple
							onSelect={onSelectImages}
						/>
					) : (
						<Gallery photos={ images } direction={direction} />
					)}
				</div>
			</Fragment>
		);
	},
	save: props => {
		const { images, direction, isLightboxEnabled } = props.attributes;
		return (
			<div className={`${direction}`} data-direction={direction} data-isLightboxEnabled={isLightboxEnabled}>
				{images.map( img => (
					<img 
						src={img.src}
						alt={img.alt}
						title={img.caption}
						data-id={img.id}
						width={img.width}
						height={img.height}
					/>
				))}
			</div>
		);
	}
} );