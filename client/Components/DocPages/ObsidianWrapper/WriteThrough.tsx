import { React, CodeBlock, dracula } from '../../../../deps.ts';

const WriteThrough = (props: any) => {
  return (
    <div className="docContainer">
      <h1>Write Through Caching</h1>
      <p>
        In this chapter, we'll cover how to implement a write-through caching strategy with Obsidian, as opposed to the default cache-aside paradigm.
      </p>
      <h2>Set writeThrough to true</h2>
      <p>
        When running your<code className="obsidianInline"> mutations</code> with ObsidianWrapper, you can configure the GraphQL operation with five parameters.
      </p>
      <CodeBlock language="tsx" showLineNumbers={true} style={dracula}>
        {`// AppComponent.tsx
async function mutate(mutation, options = {}) {
	mutation = insertTypenames(mutation);
	const {
		endpoint = '/graphql',
		cacheWrite = true,
		toDelete = false,
		update = null,
		writeThrough = false,
	} = options;
}
};`}
      </CodeBlock>
			<p>By default, the <code className="obsidianInline">writeThrough</code> parameter is set to false. Set it to true if you want to use that caching strategy.</p>
			<CodeBlock language="tsx" showLineNumbers={true} style={dracula}>
        {`if (writethrough) {
	// write to cache and GraphQL server
} else {
	// write to GraphQL server only; write to cache on subsequent reads
}`}
      </CodeBlock>
			<p>As shown above, a different logic flow and different actions are taken depending on whether or not writeThrough is set to true.</p>
			<CodeBlock language="tsx" showLineNumbers={true} style={dracula}>
			{`
constructResponseObject(queryObj, respObj, deleteFlag) {
	// __typename, properties, etc.
}
			`}
			</CodeBlock>
			<p>Because the data is written to the cache immediately instead of after a response from the GraphQL server, we have to construct the response object ourselves. On the back end, we have implemented logic to track information related to GraphQL schemas in order to construct the response object for caching without needing to ping GraphQL.</p>
			<p>Write-through introduces extra write latency because two write operations (to both the cache and GraphQL server) need to be made, but that translates to faster read times and always-fresh cache data.</p>
			<p>We recommend using it for read-heavy environments or situations where a data consistency guarantee is important.</p>
			<p>Read more about write-through caching and cache invalidation <a href="https://docs.oracle.com/cd/E15357_01/coh.360/e15723/cache_rtwtwbra.htm#COHDG5177">here</a>.</p>
    </div>
  );
};

export default WriteThrough;
