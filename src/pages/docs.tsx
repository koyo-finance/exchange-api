import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { createSwaggerSpec } from 'next-swagger-doc';
import getConfig from 'next/config';
import dynamic from 'next/dynamic';
import React from 'react';

import 'swagger-ui-react/swagger-ui.css';

const { publicRuntimeConfig } = getConfig();
const SwaggerUI = dynamic<{
	spec: any;
	// @ts-expect-error Hah
}>(import('swagger-ui-react'), { ssr: false });

function ApiDoc({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {
	return <SwaggerUI spec={spec} />;
}

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticProps: GetStaticProps = async () => {
	const spec: Record<string, any> = createSwaggerSpec({
		apiFolder: 'src/pages/api',
		definition: {
			openapi: '3.0.0',
			info: {
				title: 'Kōyō Finance Exchange API',
				version: publicRuntimeConfig.version
			}
		}
	});

	return {
		props: {
			spec
		}
	};
};

export default ApiDoc;
